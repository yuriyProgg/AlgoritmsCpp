#pragma once

#include "database.h"
#include <sqlite3.h>
#include <string>
#include <vector>

namespace app {
class Sorter {
public:
  explicit Sorter(std::vector<Order> orders);

  // Доступ к текущему состоюнию вектора
  [[nodiscard]] const std::vector<Order> &orders() const noexcept;

  // Медленные алогоритмы O(n^2)
  [[nodiscard]] std::vector<Order> bubble_sort() const;
  [[nodiscard]] std::vector<Order> selection_sort() const;
  [[nodiscard]] std::vector<Order> insertion_sort() const;

  // Среднее алгоритмы O(n)
  [[nodiscard]] std::vector<Order> shell_sort() const;

  // Быстрые алгоритмы O(n log n)
  [[nodiscard]] std::vector<Order> quick_sort() const;
  [[nodiscard]] std::vector<Order> merge_sort() const;
  [[nodiscard]] std::vector<Order> heap_sort() const;

private:
  std::vector<Order> orders_;

  // Вспомогательные методы для Merge Sort
  static void merge(std::vector<Order> &result, size_t left, size_t mid,
                    size_t right);
  static void merge_sort_recursive(std::vector<Order> &result, size_t left,
                                   size_t right);

  // Вспомогательные методы для Quick Sort
  static size_t partition(std::vector<Order> &result, size_t low, size_t high);
  static void quick_sort_recursive(std::vector<Order> &result, size_t low,
                                   size_t high);

  // Вспомогательные методы для Heap Sort
  static void heapify(std::vector<Order> &result, size_t n, size_t i);
};
} // namespace app
