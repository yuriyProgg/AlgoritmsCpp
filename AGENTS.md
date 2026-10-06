# AGENTS.md

## Сборка
- `make dev` — Debug (`build/debug`), `make release` — Release (`build/release`).
- `make mingw` / `make mingwdev` — кросс-компиляция под Windows (`x86_64-w64-mingw32-g++` + `windres` должны быть в PATH).
- `make clean*` — очистка; артефакты только в `build/`, исходники только в `src/`.
- Зависимость: SQLite3 (`find_package(SQLite3 REQUIRED)`, линковка `SQLite::SQLite3`).

## Структура
- Один бинарник `AlgoritmsCpp` (опечатка в имени — историческая, не переименовывать).
- `src/main.cc` — точка входа (сейчас заглушка `return 0`).
- `src/*.cc` + `src/*.h` собираются через `GLOB_RECURSE`, `src/main.cc` исключён явно.
- Инклуды от корня репозитория: `#include "src/database.h"`, `target_include_directories` — корень.
- `src/database.{h,cc}` — `OrderRepository` на `std::expected` + RAII (`DBHandle`, `StmtHandle`); большинство методов пока только объявлены.
- `src/algoritms.{h,cc}` — пустые, точка расширения под алгоритмы.

## Конвенции
- Стандарт C++23 (`CMAKE_CXX_STANDARD 23`, `CMAKE_CXX_EXTENSIONS OFF`).
- Расширения строго `.cc` / `.h` (не `.cpp` / `.hpp`) — иначе `GLOB` их не подхватит.
- Ошибки SQLite — через `std::expected<..., std::string>`, не исключения; ресурсы SQLite только через существующие RAII-делетеры (`sqlite3_close` / `sqlite3_finalize`).
- Тестов, линтера и CI нет — проверка только сборкой (`make dev`) и запуском бинарника.
