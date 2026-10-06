#include "database.h"
#include <expected>
#include <string_view>

namespace app {

void SQLite3Deleter::operator()(sqlite3 *db) const { sqlite3_close(db); }

void SQLite3StmtDeleter::operator()(sqlite3_stmt *stmt) const {
  sqlite3_finalize(stmt);
}

OrderRepository::OrderRepository(DBHandle db) : db_(std::move(db)) {}

std::expected<OrderRepository, std::string>
OrderRepository::open(const std::string &db_path) {
  sqlite3 *raw_db = nullptr;
  if (sqlite3_open(db_path.c_str(), &raw_db) != SQLITE_OK) {
    std::string err = raw_db ? sqlite3_errmsg(raw_db)
                             : "Failed to allocate memory for SQLite";
    if (raw_db)
      sqlite3_close(raw_db);
    return std::unexpected(err);
  }
  return OrderRepository(DBHandle(raw_db));
}

// Инициализация схемы БД
std::expected<void, std::string> OrderRepository::init_schema() const {
  std::string_view sql = R"(
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cargo_type VARCHAR(50),
      distance_weight REAL,
      price_weight INT,
      time_critical_weight,
      composite_score REAL
    );
  )";
  return execute_raw(sql);
}

// Сохранение записи в БД
std::expected<void, std::string>
OrderRepository::save(const Order &order) const {
  constexpr const char *sql = R"(
    INSERT INTO orders (cargo_type, distance_weight, price_weight, time_critical_weight, composite_score)
    VALUES (?, ?, ?, ?, ?)
  )";
  auto stmt = prepare(sql);
  if (!stmt)
    return std::unexpected(stmt.error());
  StmtHandle stmt_handle(std::move(*stmt));

  // Биндинг параметров записи
  sqlite3_bind_text(stmt_handle.get(), 1, order.cargo_type.c_str(), -1,
                    SQLITE_STATIC);
  sqlite3_bind_double(stmt_handle.get(), 2, order.distance_weight);
  sqlite3_bind_int(stmt_handle.get(), 3, order.price_weight);
  sqlite3_bind_int(stmt_handle.get(), 4, order.time_critical_weight);
  sqlite3_bind_double(stmt_handle.get(), 5, order.composite_score);

  if (sqlite3_step(stmt_handle.get()) != SQLITE_DONE)
    return std::unexpected(sqlite3_errmsg(db_.get()));
  return {};
}

// Нахождение записи по id
std::expected<Order, std::string>
OrderRepository::find_by_id(sqlite3_int64 id) const {
  constexpr const char *sql = R"(
    SELECT id, cargo_type, distance_weight, price_weight, time_critical_weight, composite_score
    FROM orders
    WHERE id = ?
  )";
  auto stmt = prepare(sql);
  if (!stmt)
    return std::unexpected(stmt.error());
  StmtHandle stmt_handle(std::move(*stmt));

  sqlite3_bind_int64(stmt_handle.get(), 1, id);

  int step_result = sqlite3_step(stmt_handle.get());
  switch (step_result) {
  case SQLITE_ROW:
    return extract_order(stmt_handle.get());
  case SQLITE_DONE:
    return std::unexpected("Order with id " + std::to_string(id) +
                           " not found");
  default:
    return std::unexpected(sqlite3_errmsg(db_.get()));
  }
}

// Нахождение всех записей
std::expected<std::vector<Order>, std::string>
OrderRepository::find_all() const {
  constexpr const char *sql = R"(
    SELECT id, cargo_type, distance_weight, price_weight, time_critical_weight, composite_score
    FROM orders
  )";
  auto stmt = prepare(sql);
  if (!stmt)
    return std::unexpected(stmt.error());
  StmtHandle stmt_handle(std::move(*stmt));

  std::vector<Order> orders;
  while (sqlite3_step(stmt_handle.get()) == SQLITE_ROW) {
    orders.push_back(extract_order(stmt_handle.get()));
  }
  return orders;
}

// Удаление записи по id
std::expected<void, std::string>
OrderRepository::delete_by_id(sqlite3_int64 id) const {
  constexpr const char *sql = R"(
    DELETE FROM orders
    WHERE id = ?
  )";
  auto stmt = prepare(sql);
  if (!stmt)
    return std::unexpected(stmt.error());
  StmtHandle stmt_handle(std::move(*stmt));

  sqlite3_bind_int64(stmt_handle.get(), 1, id);

  if (sqlite3_step(stmt_handle.get()) != SQLITE_DONE)
    return std::unexpected(sqlite3_errmsg(db_.get()));
  return {};
}

// Вспомогательный метод подготовки выражений
std::expected<StmtHandle, std::string>
OrderRepository::prepare(const char *sql) const {
  sqlite3_stmt *stmt = nullptr;
  if (sqlite3_prepare_v2(db_.get(), sql, -1, &stmt, nullptr) != SQLITE_OK) {
    return std::unexpected(sqlite3_errmsg(db_.get()));
  }
  return StmtHandle(stmt);
}

// Выполнение сырого SQL-запроса без параметров
std::expected<void, std::string>
OrderRepository::execute_raw(std::string_view sql) const {
  char *err_msg = nullptr;
  if (sqlite3_exec(db_.get(), sql.data(), nullptr, nullptr, &err_msg) !=
      SQLITE_OK) {
    std::string error = err_msg ? err_msg : "Unknown SQLite error";
    sqlite3_free(err_msg);
    return std::unexpected(error);
  }
  return {};
}

// Извлечение объекта Order из текущей строки sqlite3_stmt
Order OrderRepository::extract_order(sqlite3_stmt *stmt) {
  Order order;
  order.id = sqlite3_column_int64(stmt, 0);

  const unsigned char *text = sqlite3_column_text(stmt, 1);
  order.cargo_type = text ? reinterpret_cast<const char *>(text) : "";

  order.distance_weight = sqlite3_column_double(stmt, 2);
  order.price_weight = sqlite3_column_int(stmt, 3);
  order.time_critical_weight = sqlite3_column_int(stmt, 4);
  order.composite_score = sqlite3_column_double(stmt, 5);
  return order;
}
} // namespace app
