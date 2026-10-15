#pragma once

#include "src/algoritms/sorter.h"
#include <QObject>
#include <QString>

namespace app {

class SorterController : public QObject {
  Q_OBJECT
public:
  explicit SorterController(Sorter sorter, QObject *parent = nullptr);
public slots:
  void bubble_sort();
  void selection_sort();
  void insertion_sort();
  void shell_sort();
  void quick_sort();
  void merge_sort();
  void heap_sort();
signals:
  void ready_data(const QString &json);

private:
  Sorter sorter_;
};

} // namespace app
