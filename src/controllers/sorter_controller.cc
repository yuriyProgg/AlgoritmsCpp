#include "src/controllers/sorter_controller.h"
#include "src/utils/utils.h"
#include <QJsonArray>
#include <QJsonDocument>

namespace app {

SorterController::SorterController(Sorter sorter, QObject *parent)
    : QObject(parent), sorter_(std::move(sorter)) {}

void SorterController::bubble_sort() {
  std::vector<Order> result = sorter_.bubble_sort();
  QJsonArray data;
  for (const auto &order : result)
    data.append(to_json(order));
  QJsonDocument doc(data);
  emit ready_data(QString::fromUtf8(doc.toJson(QJsonDocument::Compact)));
}

void SorterController::selection_sort() {
  std::vector<Order> result = sorter_.selection_sort();
  QJsonArray data;
  for (const auto &order : result)
    data.append(to_json(order));
  QJsonDocument doc(data);
  emit ready_data(QString::fromUtf8(doc.toJson(QJsonDocument::Compact)));
}

void SorterController::insertion_sort() {
  std::vector<Order> result = sorter_.insertion_sort();
  QJsonArray data;
  for (const auto &order : result)
    data.append(to_json(order));
  QJsonDocument doc(data);
  emit ready_data(QString::fromUtf8(doc.toJson(QJsonDocument::Compact)));
}

void SorterController::shell_sort() {
  std::vector<Order> result = sorter_.shell_sort();
  QJsonArray data;
  for (const auto &order : result)
    data.append(to_json(order));
  QJsonDocument doc(data);
  emit ready_data(QString::fromUtf8(doc.toJson(QJsonDocument::Compact)));
}

void SorterController::quick_sort() {
  std::vector<Order> result = sorter_.quick_sort();
  QJsonArray data;
  for (const auto &order : result)
    data.append(to_json(order));
  QJsonDocument doc(data);
  emit ready_data(QString::fromUtf8(doc.toJson(QJsonDocument::Compact)));
}

void SorterController::merge_sort() {
  std::vector<Order> result = sorter_.merge_sort();
  QJsonArray data;
  for (const auto &order : result)
    data.append(to_json(order));
  QJsonDocument doc(data);
  emit ready_data(QString::fromUtf8(doc.toJson(QJsonDocument::Compact)));
}

void SorterController::heap_sort() {
  std::vector<Order> result = sorter_.heap_sort();
  QJsonArray data;
  for (const auto &order : result)
    data.append(to_json(order));
  QJsonDocument doc(data);
  emit ready_data(QString::fromUtf8(doc.toJson(QJsonDocument::Compact)));
}

} // namespace app
