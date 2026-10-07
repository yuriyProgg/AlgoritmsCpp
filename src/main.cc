/*
 * Больше интересных проектов смотрите в моём GitHub:
 * https://github.com/yuriyProgg
 *
 * More interesting projects you can find in my
 * GitHub: https://github.com/yuriyProgg
 * */

#include "algoritms.h"
#include "database.h"
#include <chrono>
#include <clocale>
#include <cmath>
#include <cstdlib>
#include <iostream>
#include <limits>
#include <string>
#include <utility>
#include <vector>

namespace {

void clear_screen() {
#ifdef _WIN32
  std::system("cls");
#else
  std::system("clear");
#endif
}

void consume_line() {
  std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}

std::string read_cargo_type() {
  std::string s;
  while (true) {
    std::cout << "cargo_type (1-50 characters): ";
    if (!std::getline(std::cin, s)) {
      std::cin.clear();
      continue;
    }
    if (!s.empty() && s.back() == '\r')
      s.pop_back();
    if (s.empty() || s.size() > 50) {
      std::cout << "Error: length must be 1-50 characters.\n";
      continue;
    }
    return s;
  }
}

double read_double(const char *prompt) {
  double v{};
  while (true) {
    std::cout << prompt;
    if ((std::cin >> v) && std::isfinite(v)) {
      consume_line();
      return v;
    }
    std::cout << "Error: enter a number.\n";
    std::cin.clear();
    consume_line();
  }
}

int read_int(const char *prompt) {
  int v{};
  while (true) {
    std::cout << prompt;
    if (std::cin >> v) {
      consume_line();
      return v;
    }
    std::cout << "Error: enter an integer.\n";
    std::cin.clear();
    consume_line();
  }
}

app::Order input_order() {
  app::Order o{};
  o.id = 0;
  o.cargo_type = read_cargo_type();
  o.distance_weight = read_double("distance_weight (REAL): ");
  o.price_weight = read_int("price_weight (INT): ");
  o.time_critical_weight = read_int("time_critical_weight (INT): ");
  o.composite_score = read_double("composite_score (REAL): ");
  return o;
}

void print_orders(const std::vector<app::Order> &orders) {
  size_t i = 0;
  for (const auto &o : orders) {
    ++i;
    std::cout << i << "\t" << "ID: " << o.id << "; CARGO TYPE: " << o.cargo_type
              << "; COMPOSITE SCORE: " << o.composite_score << ";\n";
  }
}

struct BenchResult {
  std::string name;
  long long micros = 0;
  std::vector<app::Order> sorted;
};

BenchResult run_bench(const std::string &name, const app::Sorter &sorter,
                      std::vector<app::Order> (app::Sorter::*fn)() const) {
  const auto t0 = std::chrono::steady_clock::now();
  std::vector<app::Order> sorted = (sorter.*fn)();
  const auto t1 = std::chrono::steady_clock::now();
  return {
      name,
      std::chrono::duration_cast<std::chrono::microseconds>(t1 - t0).count(),
      std::move(sorted)};
}

std::vector<BenchResult> bench_all(const app::Sorter &sorter) {
  std::vector<BenchResult> out;
  out.push_back(run_bench("bubble_sort", sorter, &app::Sorter::bubble_sort));
  out.push_back(
      run_bench("selection_sort", sorter, &app::Sorter::selection_sort));
  out.push_back(
      run_bench("insertion_sort", sorter, &app::Sorter::insertion_sort));
  out.push_back(run_bench("shell_sort", sorter, &app::Sorter::shell_sort));
  out.push_back(run_bench("quick_sort", sorter, &app::Sorter::quick_sort));
  out.push_back(run_bench("merge_sort", sorter, &app::Sorter::merge_sort));
  out.push_back(run_bench("heap_sort", sorter, &app::Sorter::heap_sort));
  return out;
}

void print_bench(const std::vector<BenchResult> &results) {
  std::cout << "--- Sorting time (us) ---\n";
  for (const auto &r : results)
    std::cout << r.name << ": " << r.micros << " us\n";
}

void print_menu() {
  std::cout << "\n--- Menu ---\n"
               "1. bubble_sort\n"
               "2. selection_sort\n"
               "3. insertion_sort\n"
               "4. shell_sort\n"
               "5. quick_sort\n"
               "6. merge_sort\n"
               "7. heap_sort\n"
               "8. Show all sorting times\n"
               "9. Create Order record\n"
               "10. Clear screen\n"
               "0. Exit\n"
               "Choice: ";
}

bool refresh_from_db(const app::OrderRepository &repo, app::Sorter &sorter,
                     std::vector<BenchResult> &results) {
  auto fresh = repo.find_all();
  if (!fresh) {
    std::cerr << " Failed to load records from DB: " << fresh.error() << '\n';
    return false;
  }
  sorter = app::Sorter(*fresh);
  results = bench_all(sorter);
  return true;
}

} // namespace

int main(int argc, char *argv[]) {
  setlocale(LC_ALL, "ru");
  // Открываем БД
  auto repo_res = app::OrderRepository::open("orders.db");
  if (!repo_res) {
    std::cerr << " DB connection error: " << repo_res.error() << '\n';
    return 1;
  }
  app::OrderRepository repo = std::move(*repo_res);
  // Создаем схему
  if (auto init_res = repo.init_schema(); !init_res) {
    std::cerr << " Schema init error: " << init_res.error() << '\n';
    return 1;
  }
  // Находим все записи
  auto orders = repo.find_all();
  if (!orders) {
    std::cerr << " Failed to load records from DB: " << orders.error() << '\n';
    return 1;
  }
  if (orders->empty())
    std::cout << "Table orders is empty.\n";

  // Создаем сортировщик
  app::Sorter sorter(std::move(*orders));

  // Замеряем все методы и выводим время
  std::vector<BenchResult> results = bench_all(sorter);
  print_bench(results);

  // Выбор результатов через меню
  int choice = -1;
  do {
    print_menu();
    if (!(std::cin >> choice)) {
      std::cin.clear();
      consume_line();
      choice = -1;
    } else {
      consume_line();
    }
    if (choice >= 1 && choice <= 7) {
      const auto &r = results[static_cast<size_t>(choice) - 1];
      std::cout << "--- " << r.name << " (" << r.micros << " us) ---\n";
      print_orders(r.sorted);
    } else if (choice == 8) {
      results = bench_all(sorter);
      print_bench(results);
    } else if (choice == 9) {
      std::cout << "--- Create Order (id assigned by DB) ---\n";
      app::Order o = input_order();
      if (auto s = repo.save(o); !s) {
        std::cerr << " Save error: " << s.error() << '\n';
      } else if (refresh_from_db(repo, sorter, results)) {
        std::cout << "Order saved. Total records: " << sorter.orders().size()
                  << '\n';
        print_bench(results);
      }
    } else if (choice == 10) {
      clear_screen();
    } else if (choice != 0) {
      std::cout << "Invalid choice.\n";
    }
  } while (choice != 0);

  return 0;
}
