/*
 * AlgorithmsCpp
 * Copyright (C) 2026  Yuri Masalov
 *
 * Больше интересных проектов смотрите в моём GitHub:
 * https://github.com/yuriyProgg
 *
 * More interesting projects you can find in my
 * GitHub: https://github.com/yuriyProgg
 * */

#include "src/algoritms/sorter.h"
#include "src/controllers/sorter_controller.h"
#include "src/storage/database.h"
#include <QApplication>
#include <QCoreApplication>
#include <QDir>
#include <QFileInfo>
#include <QLoggingCategory>
#include <QUrl>
#include <qlogging.h>
#ifdef HAVE_WEBENGINE_WIDGETS
#include <QWebChannel>
#include <QWebEnginePage>
#include <QWebEngineView>
#else
#include <QMessageBox>
#endif

int main(int argc, char *argv[]) {
  QApplication app(argc, argv);

#ifdef HAVE_WEBENGINE_WIDGETS
  QWebEngineView view;
#ifdef NDEBUG
  const QString nextToBinary = QDir(QCoreApplication::applicationDirPath())
                                   .filePath("frontend_dist/index.html");
  QString path = nextToBinary;
#ifdef APP_SOURCE_DIR
  const QString inSource = QDir(QString::fromUtf8(APP_SOURCE_DIR))
                               .filePath("src-ui/dist/index.html");
  if (!QFileInfo::exists(path) && QFileInfo::exists(inSource))
    path = inSource;
#endif

  view.setUrl(QUrl::fromLocalFile(path));
#else
  view.setUrl(QUrl("http://localhost:5173"));
#endif
  // Открываем БД
  auto repo_res = app::OrderRepository::open("orders.db");
  if (!repo_res) {
    qCritical() << "Ошибка подключения к БД: " << repo_res.error() << '\n';
    return 1;
  }
  app::OrderRepository repo = std::move(*repo_res);
  // Создаем схему
  if (auto init_res = repo.init_schema(); !init_res) {
    qCritical() << "Ошибка инициализации схемы: " << init_res.error() << '\n';
    return 1;
  }
  // Находим все записи
  auto orders = repo.find_all();
  if (!orders) {
    qCritical() << " Ошибка получения записей из БД: " << orders.error()
                << '\n';
    return 1;
  }
  if (orders->empty())
    qWarning() << "В таблице orders нет записей.\n";

  // Создаем сортировщик
  app::Sorter sorter(std::move(*orders));
  QWebEnginePage *page = view.page();
  QWebChannel *channel = new QWebChannel(&view);
  app::SorterController *sorter_controller = new app::SorterController(sorter);
  channel->registerObject("sorter", sorter_controller);
  page->setWebChannel(channel);
  view.resize(800, 600);
  view.show();
#else
  QMessageBox::critical(this, "Ошибка",
                        "WebEngine недоступен: установите qt6-webengine-dev");
#endif

  return app.exec();
}
