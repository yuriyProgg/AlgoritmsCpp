#include "src/utils/utils.h"

namespace app {

QJsonObject to_json(const Order &order) {
  QJsonObject json;
  json["id"] = static_cast<qint64>(order.id);
  json["cargo_type"] = QString::fromStdString(order.cargo_type);
  json["distance_weight"] = order.distance_weight;
  json["price_weight"] = order.price_weight;
  json["time_critical_weight"] = order.time_critical_weight;
  json["composite_score"] = order.composite_score;
  return json;
}

} // namespace app
