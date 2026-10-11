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

#include <QApplication>
#include <QCoreApplication>
#include <QDir>
#include <QFileInfo>
#include <QUrl>
#ifdef HAVE_WEBENGINE_WIDGETS
#include <QWebEngineView>
#else
#include <QLabel>
#endif

int main(int argc, char *argv[]) {
  QApplication app(argc, argv);

#ifdef HAVE_WEBENGINE_WIDGETS
  QWebEngineView view;
#ifdef NDEBUG
  const QString nextToBinary =
      QDir(QCoreApplication::applicationDirPath()).filePath("frontend_dist/index.html");
  QString path = nextToBinary;
#ifdef APP_SOURCE_DIR
  const QString inSource =
      QDir(QString::fromUtf8(APP_SOURCE_DIR)).filePath("src-ui/dist/index.html");
  if (!QFileInfo::exists(path) && QFileInfo::exists(inSource))
    path = inSource;
#endif

  view.setUrl(QUrl::fromLocalFile(path));
#else
  view.setUrl(QUrl("http://localhost:5173"));
#endif
  view.resize(800, 600);
  view.show();
#else
  QLabel fallback("WebEngine недоступен: установите qt6-webengine-dev");
  fallback.resize(800, 600);
  fallback.show();
#endif

  return app.exec();
}
