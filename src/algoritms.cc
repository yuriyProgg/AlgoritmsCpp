#include "algoritms.h"
#include <utility>
#include <vector>

namespace app {

Sorter::Sorter(std::vector<Order> orders) : orders_(std::move(orders)) {}

const std::vector<Order> &Sorter::orders() const noexcept { return orders_; }

// Медленные алогоритмы O(n^2)

std::vector<Order> Sorter::bubble_sort() const {
  std::vector<Order> result = orders_;
  const size_t n = result.size();
  if (n <= 1)
    return result;
  for (size_t i = 0; i < n - 1; ++i) {
    bool swapped = false;
    for (size_t j = 0; j < n - i - 1; ++j) {
      if (result[j].composite_score > result[j + 1].composite_score) {
        std::swap(result[j], result[j + 1]);
        swapped = true;
      }
    }
    if (!swapped)
      break;
  }
  return result;
}

std::vector<Order> Sorter::selection_sort() const {
  std::vector<Order> result = orders_;
  const size_t n = result.size();
  if (n <= 1)
    return result;
  for (size_t i = 0; i < n - 1; ++i) {
    size_t min_idx = i;
    for (size_t j = i + 1; j < n; ++j) {
      if (result[j].composite_score < result[min_idx].composite_score)
        min_idx = j;
    }
    if (min_idx != i)
      std::swap(result[i], result[min_idx]);
  }
  return result;
}

std::vector<Order> Sorter::insertion_sort() const {
  std::vector<Order> result = orders_;
  const size_t n = result.size();
  if (n <= 1)
    return result;
  for (size_t i = 1; i < n; ++i) {
    Order current = result[i];
    size_t j = i;
    while (j > 0 && result[j - 1].composite_score > current.composite_score) {
      result[j] = result[j - 1];
      --j;
    }
    result[j] = std::move(current);
  }
  return result;
}

// Среднее алгоритмы O(n)

std::vector<Order> Sorter::shell_sort() const {
  std::vector<Order> result = orders_;
  const size_t n = result.size();
  if (n <= 1)
    return result;
  for (size_t gap = n / 2; gap > 0; gap /= 2) {
    for (size_t i = gap; i < n; ++i) {
      Order current = std::move(result[i]);
      size_t j = i;
      while (j >= gap &&
             result[j - gap].composite_score > current.composite_score) {
        result[j] = std::move(result[j - gap]);
        j -= gap;
      }
      result[j] = std::move(current);
    }
  }
  return result;
}

// Быстрые алгоритмы O(n log n)

void Sorter::merge(std::vector<Order> &result, size_t left, size_t mid,
                   size_t right) {
  std::vector<Order> left_part(result.begin() + left, result.begin() + mid + 1);
  std::vector<Order> right_part(result.begin() + mid + 1,
                                result.begin() + right + 1);
  size_t i = 0, j = 0, k = left;
  while (i < left_part.size() && j < right_part.size())
    if (left_part[i].composite_score <= right_part[j].composite_score)
      result[k++] = std::move(left_part[i++]);
    else
      result[k++] = std::move(right_part[j++]);
  while (i < left_part.size())
    result[k++] = std::move(left_part[i++]);
  while (j < right_part.size())
    result[k++] = std::move(right_part[j++]);
}

void Sorter::merge_sort_recursive(std::vector<Order> &result, size_t left,
                                  size_t right) {
  if (left >= right)
    return;
  size_t mid = (left + right) / 2;
  merge_sort_recursive(result, left, mid);
  merge_sort_recursive(result, mid + 1, right);
  merge(result, left, mid, right);
}

std::vector<Order> Sorter::merge_sort() const {
  std::vector<Order> result = orders_;
  const size_t n = result.size();
  if (n <= 1)
    return result;
  merge_sort_recursive(result, 0, n - 1);
  return result;
}

size_t Sorter::partition(std::vector<Order> &result, size_t low, size_t high) {
  const double pivot = result[high].composite_score;
  size_t i = low;
  for (size_t j = low; j < high; ++j) {
    if (result[j].composite_score <= pivot) {
      std::swap(result[i], result[j]);
      ++i;
    }
  }
  std::swap(result[i], result[high]);
  return i;
}

void Sorter::quick_sort_recursive(std::vector<Order> &result, size_t low,
                                  size_t high) {
  if (low >= high)
    return;
  const size_t pi = partition(result, low, high);
  if (pi > low)
    quick_sort_recursive(result, low, pi - 1);
  if (pi < high)
    quick_sort_recursive(result, pi + 1, high);
}

std::vector<Order> Sorter::quick_sort() const {
  std::vector<Order> result = orders_;
  const size_t n = result.size();
  if (n <= 1)
    return result;
  quick_sort_recursive(result, 0, n - 1);
  return result;
}

// Быстрые алгоритмы O(n log n)

void Sorter::heapify(std::vector<Order> &result, size_t n, size_t i) {
  size_t largest = i;
  size_t left = 2 * i + 1;
  size_t right = 2 * i + 2;
  if (left < n &&
      result[left].composite_score > result[largest].composite_score)
    largest = left;
  if (right < n &&
      result[right].composite_score > result[largest].composite_score)
    largest = right;
  if (largest != i) {
    std::swap(result[i], result[largest]);
    heapify(result, n, largest);
  }
}

std::vector<Order> Sorter::heap_sort() const {
  std::vector<Order> result = orders_;
  const size_t n = result.size();
  if (n <= 1)
    return result;
  for (size_t i = n / 2; i-- > 0;)
    heapify(result, n, i);
  for (size_t i = n - 1; i > 0; --i) {
    std::swap(result[0], result[i]);
    heapify(result, i, 0);
  }
  return result;
}

} // namespace app
