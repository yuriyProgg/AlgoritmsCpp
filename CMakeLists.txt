cmake_minimum_required(VERSION 3.31.6)
project(AlgoritmsCpp LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)

# --- 0. ПОИСК QT6 И BUN ДЛЯ ФРОНТЕНДА ---
find_package(Qt6 REQUIRED COMPONENTS Core Widgets Sql)
find_package(Qt6 OPTIONAL_COMPONENTS WebEngineWidgets)

if(CMAKE_BUILD_TYPE STREQUAL "Release")
  set(FRONTEND_DIR "${CMAKE_CURRENT_SOURCE_DIR}/src-ui")
  if(EXISTS "${FRONTEND_DIR}/package.json")
    find_program(BUN_EXECUTABLE NAMES bun)
    if(BUN_EXECUTABLE)
      message(STATUS "Найден Bun. Настраиваем сборку React-интерфейса...")

      # Установка зависимостей через bun install при изменении package.json
      add_custom_command(
        OUTPUT "${FRONTEND_DIR}/node_modules"
        COMMAND ${BUN_EXECUTABLE} install
        WORKING_DIRECTORY "${FRONTEND_DIR}"
        COMMENT "Установка NPM-зависимостей через Bun...")

      # Сборка продакшн-билда React через bun
      add_custom_target(
        frontend_build
        DEPENDS "${FRONTEND_DIR}/node_modules"
        COMMAND ${BUN_EXECUTABLE} run build
        WORKING_DIRECTORY "${FRONTEND_DIR}"
        COMMENT "Сборка React TS фронтенда через Bun...")
    else()
      message(WARNING "Bun не найден в системе. Сборка фронтенда пропущена.")
    endif()
  endif()
endif()

# --- 1. СБОРКА SQLITE (Вендорный) ---
add_library(sqlite3 STATIC
            "${CMAKE_CURRENT_SOURCE_DIR}/include/sqlite3/sqlite3.c")
target_include_directories(sqlite3
                           PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include/sqlite3")
set_target_properties(sqlite3 PROPERTIES POSITION_INDEPENDENT_CODE ON)

# Глушим предупреждения из вендорного C-файла
if(CMAKE_C_COMPILER_ID MATCHES "GNU|Clang|AppleClang")
  target_compile_options(sqlite3 PRIVATE -w)
elseif(MSVC)
  target_compile_options(sqlite3 PRIVATE /W0)
endif()

# Оптимизация компиляции sqlite3.c для Release/RelWithDebInfo (-O1)
if(CMAKE_C_COMPILER_ID MATCHES "GNU|Clang|AppleClang")
  target_compile_options(sqlite3
                         PRIVATE $<$<CONFIG:Release,RelWithDebInfo>:-O1>)
elseif(MSVC)
  target_compile_options(sqlite3
                         PRIVATE $<$<CONFIG:Release,RelWithDebInfo>:/O1>)
endif()

find_package(Threads REQUIRED)
target_link_libraries(sqlite3 PUBLIC Threads::Threads)
if(UNIX AND NOT WIN32)
  target_link_libraries(sqlite3 PUBLIC ${CMAKE_DL_LIBS})
  target_link_libraries(sqlite3 PUBLIC m)
endif()

# --- 2. СБОРКА ОСНОВНОГО ПРОЕКТА AlgoritmsCpp ---
file(GLOB_RECURSE HEADERS CONFIGURE_DEPENDS
     "${CMAKE_CURRENT_SOURCE_DIR}/src/*.h")
file(GLOB_RECURSE SOURCES CONFIGURE_DEPENDS
     "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cc")
list(REMOVE_ITEM SOURCES "${CMAKE_CURRENT_SOURCE_DIR}/src/main.cc")

add_executable(AlgoritmsCpp "${PROJECT_SOURCE_DIR}/src/main.cc")

target_sources(AlgoritmsCpp PRIVATE ${SOURCES} ${HEADERS})

target_include_directories(AlgoritmsCpp PRIVATE "${PROJECT_SOURCE_DIR}")

target_compile_definitions(
  AlgoritmsCpp PRIVATE "APP_SOURCE_DIR=\"${PROJECT_SOURCE_DIR}\"")

# Линуем Qt6 модули, SQLite и потоки
target_link_libraries(AlgoritmsCpp PRIVATE sqlite3 Qt6::Core Qt6::Widgets
                                           Qt6::Sql)
if(Qt6WebEngineWidgets_FOUND)
  target_link_libraries(AlgoritmsCpp PRIVATE Qt6::WebEngineWidgets)
  target_compile_definitions(AlgoritmsCpp PRIVATE HAVE_WEBENGINE_WIDGETS)
else()
  message(
    WARNING
      "Qt6 WebEngineWidgets не найден (sudo apt install qt6-webengine-dev). Сборка без WebEngine."
  )
endif()

# Если цель сборки фронтенда существует, привязываем её к CMake и копируем dist
if(TARGET frontend_build)
  add_dependencies(AlgoritmsCpp frontend_build)

  add_custom_command(
    TARGET AlgoritmsCpp
    POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory "${FRONTEND_DIR}/dist"
            "$<TARGET_FILE_DIR:AlgoritmsCpp>/frontend_dist"
    COMMENT "Копирование собранного React-интерфейса в папку с бинарником...")
endif()

# Статичный exe для Windows/MinGW
if(MINGW)
  target_link_options(AlgoritmsCpp PRIVATE -static -static-libgcc
                      -static-libstdc++)
endif()
