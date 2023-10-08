// モジュールのインポート
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var session = require("express-session");

// ルーターのインポート
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var hello = require("./routes/hello");

// アプリケーションの初期化
var app = express();

// ビューエンジンの設定
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ミドルウェアの設定
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// セッションの設定（もし必要なら）
var session_opt = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 },
};
app.use(session(session_opt));

// ルーティングの設定
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/hello", hello);

// 404エラーハンドラ
app.use(function (req, res, next) {
  next(createError(404));
});

// エラーハンドラ
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// エクスポート
module.exports = app;
