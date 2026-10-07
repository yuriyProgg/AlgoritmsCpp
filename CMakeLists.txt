cmake_minimum_required(VERSION 3.31.6)
project(AlgoritmsCpp LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

add_library(sqlite3 STATIC
            "${CMAKE_CURRENT_SOURCE_DIR}/include/sqlite3/sqlite3.c")
target_include_directories(sqlite3
                           PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include/sqlite3")
set_target_properties(sqlite3 PROPERTIES POSITION_INDEPENDENT_CODE ON)

# Глушим предупреждения из вендорного C-файла, проектный код это не затрагивает.
if(CMAKE_C_COMPILER_ID MATCHES "GNU|Clang|AppleClang")
  target_compile_options(sqlite3 PRIVATE -w)
elseif(MSVC)
  target_compile_options(sqlite3 PRIVATE /W0)
endif()

# sqlite3.c — амальгама на 9.5 МБ: с -O3 в Release собирается минутами
# (видимое "зависание" на 16%). Для малых объёмов БД достаточно -O1.
if(CMAKE_C_COMPILER_ID MATCHES "GNU|Clang|AppleClang")
  target_compile_options(sqlite3 PRIVATE
                         $<$<CONFIG:Release,RelWithDebInfo>:-O1>)
elseif(MSVC)
  target_compile_options(sqlite3 PRIVATE
                         $<$<CONFIG:Release,RelWithDebInfo>:/O1>)
endif()

# Зависимости SQLite: потоки везде, dl + m только на настоящем Unix (не
# Windows/MinGW).
find_package(Threads REQUIRED)
target_link_libraries(sqlite3 PUBLIC Threads::Threads)
if(UNIX AND NOT WIN32)
  target_link_libraries(sqlite3 PUBLIC ${CMAKE_DL_LIBS})
  target_link_libraries(sqlite3 PUBLIC m)
endif()

file(GLOB_RECURSE HEADERS CONFIGURE_DEPENDS
     "${CMAKE_CURRENT_SOURCE_DIR}/src/*.h")
file(GLOB_RECURSE SOURCES CONFIGURE_DEPENDS
     "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cc")
list(REMOVE_ITEM SOURCES "${CMAKE_CURRENT_SOURCE_DIR}/src/main.cc")

add_executable(AlgoritmsCpp src/main.cc)

target_sources(AlgoritmsCpp PRIVATE ${SOURCES} ${HEADERS})

# Позволяет писать #include "src/folder/file.h" из любой точки проекта
target_include_directories(AlgoritmsCpp PRIVATE "${CMAKE_CURRENT_SOURCE_DIR}")

target_link_libraries(AlgoritmsCpp PRIVATE sqlite3)

# Статичный exe для Windows/MinGW: запуск без libgcc_s_seh-1.dll,
# libstdc++-6.dll, libwinpthread-1.dll, без VCRedist и Visual Studio.
# Зависимости остаются только на системные KERNEL32/msvcrt.dll.
if(MINGW)
  target_link_options(AlgoritmsCpp PRIVATE -static -static-libgcc
                      -static-libstdc++)
endif()
