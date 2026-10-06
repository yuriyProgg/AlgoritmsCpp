#pragma once

#include <expected>
#include <memory>
#include <sqlite3.h>
#include <string>
#include <vector>

namespace app {
// Модель Order в базе данных
struct Order {
  sqlite3_int64 id;         // BIGINT
  std::string cargo_type;   // VARCHAR(50)
  double distance_weight;   // REAL
  int price_weight;         // INT
  int time_critical_weight; // INT
  double composite_score;   // REAL

  // Тривайный трехсторонний оператор сравнения C++20/C++23 (Spaceship operator)
  auto operator<=>(const Order &other) const {
    return composite_score <=> other.composite_score;
  }
};

// RAII Деструкторы для ресурсов SQLite3
struct SQLite3Deleter {
  void operator()(sqlite3 *db) const;
};

struct SQLite3StmtDeleter {
  void operator()(sqlite3_stmt *stmt) const;
};

using DBHandle = std::unique_ptr<sqlite3, SQLite3Deleter>;
using StmtHandle = std::unique_ptr<sqlite3_stmt, SQLite3StmtDeleter>;

// Класс для работы с БД (OrderRepository)
class OrderRepository {
public:
  static std::expected<OrderRepository, std::string>
  open(const std::string &db_path);
  // Инициализация схемы БД
  std::expected<void, std::string> init_schema() const;
  // Сохранение записи в БД
  std::expected<void, std::string> save(const Order &order) const;
  // Нахождение записи по id
  std::expected<Order, std::string> find_by_id(sqlite3_int64 id) const;
  // Нахождение всех записей
  std::expected<std::vector<Order>, std::string> find_all() const;
  // Удаление записи по id
  std::expected<void, std::string> delete_by_id(sqlite3_int64 id) const;

private:
  DBHandle db_;

  explicit OrderRepository(DBHandle db);
  // Вспомогательный метод подготовки выражений
  std::expected<StmtHandle, std::string> prepare(const char *sql) const;
  // Выполнение сырого SQL-запроса без параметров
  std::expected<void, std::string> execute_raw(std::string_view sql) const;
  // Извлечение объекта Order из текущей строки sqlite3_stmt
  static Order extract_order(sqlite3_stmt *stmt);
};
} // namespace app
