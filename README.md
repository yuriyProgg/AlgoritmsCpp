# AlgoritmsCpp

Консольное приложение на C++23 для сравнения алгоритмов сортировки на записях `Order`, хранящихся в SQLite.

При запуске читает таблицу `orders` из `orders.db`, замеряет время 7 сортировок по полю `composite_score` (в микросекундах) и даёт интерактивное меню просмотра результатов и добавления записей.

> Имя бинарника `AlgoritmsCpp` содержит историческую опечатку, не переименовывать.

## Структура

```text
.
├── CMakeLists.txt        # сборка: vendored sqlite3 + glob src/*.cc (кроме main.cc)
├── Makefile              # обёртки: dev / release / mingw / mingwdev / clean*
├── include/sqlite3/      # вендорный SQLite (sqlite3.c + sqlite3.h), собирается как static lib
├── src/
│   ├── main.cc           # точка входа: CLI-меню, бенчмарк, ввод Order
│   ├── database.h/.cc    # Order + OrderRepository (std::expected + RAII)
│   └── algoritms.h/.cc   # Sorter: 7 сортировок по composite_score
├── build/                # артефакты сборки (debug/, release/, mingw-*)
└── orders.db             # рабочая БД, создаётся/открывается рядом с бинарником
```

## Требования

- CMake >= 3.31.6
- Компилятор с C++23: GCC >= 14 / Clang >= 18 (проверено на GCC 14.2.0, Debian)
- `make`, `Threads`
- Для кросс-сборки под Windows: `x86_64-w64-mingw32-g++`, `x86_64-w64-mingw32-gcc`, `x86_64-w64-mingw32-windres` в `PATH`
- Отдельная установка SQLite3 не нужна, используется `include/sqlite3/sqlite3.c`

## Сборка

```sh
make dev      # Debug   -> build/debug/AlgoritmsCpp
make release  # Release -> build/release/AlgoritmsCpp
```

```sh
make mingw    # Release под Windows -> build/mingw-release/AlgoritmsCpp.exe
make mingwdev # Debug под Windows   -> build/mingw-debug/AlgoritmsCpp.exe
```

```sh
make clean                # удалить весь build/
make clean-debug          # только build/debug
make clean-release        # только build/release
make clean-mingw          # оба mingw-каталога
make clean-mingw-debug    # только build/mingw-debug
make clean-mingw-release  # только build/mingw-release
```

Прямой вызов без `Makefile`:

```sh
cmake -S . -B build/debug -DCMAKE_BUILD_TYPE=Debug
cmake --build build/debug -j"$(nproc)"
```

## Запуск

```sh
./build/debug/AlgoritmsCpp
./build/release/AlgoritmsCpp
```

Бинарник открывает (или создаёт) `orders.db` в текущем рабочем каталоге, выполняет `init_schema()`, выводит время всех сортировок, затем показывает меню:

```text
--- Меню ---
1. bubble_sort
2. selection_sort
3. insertion_sort
4. shell_sort
5. quick_sort
6. merge_sort
7. heap_sort
8. Показать время всех сортировок
9. Создать запись в модели Order
10. Очистить экран
0. Выход
```

Пункт `9` запрашивает `cargo_type` (1–50 символов), `distance_weight`, `price_weight`, `time_critical_weight`, `composite_score`, сохраняет через `OrderRepository::save()` и перезамеряет все сортировки. `id` назначает SQLite (`AUTOINCREMENT`).

## Модель данных

Таблица создаётся в `OrderRepository::init_schema()` (`src/database.cc`):

```sql
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cargo_type VARCHAR(50),
  distance_weight REAL,
  price_weight INT,
  time_critical_weight INT,
  composite_score REAL
);
```

Структура `app::Order` (`src/database.h`):

| Поле | Тип | Колонка |
|---|---|---|
| `id` | `sqlite3_int64` | `INTEGER PRIMARY KEY AUTOINCREMENT` |
| `cargo_type` | `std::string` | `VARCHAR(50)` |
| `distance_weight` | `double` | `REAL` |
| `price_weight` | `int` | `INT` |
| `time_critical_weight` | `int` | `INT` |
| `composite_score` | `double` | `REAL` |

Сортировка и `<=>` всегда по `composite_score`.

API `OrderRepository`:

- `open(path)` — открыть БД
- `init_schema()` — `CREATE TABLE IF NOT EXISTS`
- `save(order)` — `INSERT` с биндингом `?`-параметров
- `find_by_id(id)` — `SELECT ... WHERE id = ?`
- `find_all()` — `SELECT` всех записей
- `delete_by_id(id)` — `DELETE WHERE id = ?`

Ошибки возвращаются как `std::expected<..., std::string>`, исключения не используются. Ресурсы SQLite закрываются только через RAII-обёртки `DBHandle` (`sqlite3_close`) и `StmtHandle` (`sqlite3_finalize`).

## Алгоритмы

Класс `app::Sorter` (`src/algoritms.h`) копирует входной `vector<Order>` и возвращает отсортированную копию. Каждый публичный метод `[[nodiscard]]`, исходный вектор не меняется.

| Метод | Сложность |
|---|---|
| `bubble_sort` | O(n²) |
| `selection_sort` | O(n²) |
| `insertion_sort` | O(n²) |
| `shell_sort` | O(n log n) – O(n²) в зависимости от данных |
| `quick_sort` | O(n log n) средний, O(n²) худший |
| `merge_sort` | O(n log n) |
| `heap_sort` | O(n log n) |

Замер в `src/main.cc`: `std::chrono::steady_clock`, результат в микросекундах (`us`).

## Конвенции

- Стандарт C++23, `CMAKE_CXX_EXTENSIONS OFF`.
- Расширения строго `.cc` / `.h`, иначе `GLOB_RECURSE` в `CMakeLists.txt` их не подхватит.
- Инклуды от корня: `#include "src/database.h"` (`target_include_directories` — корень репозитория).
- `src/main.cc` исключён из `GLOB` и добавлен отдельно как точка входа.
- Предупреждения вендорного `sqlite3.c` глушатся (`-w` / `/W0`), к проектному коду не относится.

## Лицензия

Этот проект распространяется под лицензией [MIT](LICENSE).
