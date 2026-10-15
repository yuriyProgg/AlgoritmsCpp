#pragma once

#include "src/storage/database.h"
#include <QJsonObject>

namespace app {

QJsonObject to_json(const Order &order);

}
