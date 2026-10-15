export type SortGroup = 'slow' | 'medium' | 'fast'

export interface SortAlgo {
  id: string
  title: string
  method: string
  complexity: string
  group: SortGroup
  description: string
}

// Список строго по src/algoritms/sorter.h (app::Sorter)
export const SORT_GROUPS: Array<{ id: SortGroup; title: string; badge: string }> = [
  { id: 'slow', title: 'Медленные', badge: 'O(n²)' },
  { id: 'medium', title: 'Средние', badge: 'O(n)' },
  { id: 'fast', title: 'Быстрые', badge: 'O(n log n)' },
]

export const SORT_ALGOS: SortAlgo[] = [
  {
    id: 'bubble',
    title: 'Пузырьковая',
    method: 'bubble_sort',
    complexity: 'O(n²)',
    group: 'slow',
    description: 'Попарные обмены соседних заказов',
  },
  {
    id: 'selection',
    title: 'Выбором',
    method: 'selection_sort',
    complexity: 'O(n²)',
    group: 'slow',
    description: 'Выбор минимума на каждой итерации',
  },
  {
    id: 'insertion',
    title: 'Вставками',
    method: 'insertion_sort',
    complexity: 'O(n²)',
    group: 'slow',
    description: 'Вставка элемента в отсортированный префикс',
  },
  {
    id: 'shell',
    title: 'Шелла',
    method: 'shell_sort',
    complexity: 'O(n)',
    group: 'medium',
    description: 'Вставки с уменьшающимся шагом',
  },
  {
    id: 'quick',
    title: 'Быстрая',
    method: 'quick_sort',
    complexity: 'O(n log n)',
    group: 'fast',
    description: 'Разбиение относительно опорного элемента',
  },
  {
    id: 'merge',
    title: 'Слиянием',
    method: 'merge_sort',
    complexity: 'O(n log n)',
    group: 'fast',
    description: 'Рекурсивное слияние отсортированных половин',
  },
  {
    id: 'heap',
    title: 'Пирамидальная',
    method: 'heap_sort',
    complexity: 'O(n log n)',
    group: 'fast',
    description: 'Выборка через бинарную кучу',
  },
]
