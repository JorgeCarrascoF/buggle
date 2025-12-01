// ============================================
// app.js (CORREGIDO)
// ============================================
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var createError = require("http-errors");
const errorHandler = require("./middleware/errorHandler");
const Boom = require("@hapi/boom");

// Importar rutas
var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var usersRouter = require("./routes/users");
var rolesRouter = require("./routes/roles");
var logsRoutes = require("./routes/logs");
var suggestionRoutes = require("./routes/suggestion");

var documentRoutes = require("./routes/document");
var sentryRoutes = require("./routes/sentry");
var commentRoutes = require("./routes/comment");
var statusRegisterRoutes = require("./routes/status-register");
var suggestedUserRoutes = require("./routes/suggested-user");
var envelopeRoutes = require("./routes/envelope");
var swaggerDocs = require("./swagger/swagger");
// const { credentials } = require('amqplib');
var urlRoutes = require("./routes/urlRoutes");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://pruebas-concepto.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));

// Rutas principales
app.use("/", indexRouter);

// Rutas de API
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/logs", logsRoutes);

app.use("/api/suggestion", suggestionRoutes);

app.use("/api/documents", documentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/status-register", statusRegisterRoutes);
app.use("/api/suggested-user", suggestedUserRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/url", urlRoutes);

app.use("/api/webhook", sentryRoutes);

// Rutas CSS & images
app.use("/css", express.static("css"));
app.use("/images", express.static("images"));

//app.use("/api/:projectId/envelope", bodyParser.text({ type: "*/*" }));
app.use("/api/:projectId/envelope", envelopeRoutes);

// Configurar Swagger
swaggerDocs(app);

// catch 404 and forward to error handler
//app.use(function (req, res, next) {
//next(createError(404));
//});

// error handler
// app.use(function(err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   res.status(err.status || 500);

app.use((req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    error: "Not Found",
    message: `Endpoint ${req.originalUrl} does not exist`,
  });
});

app.use((err, req, res, next) => {
  if (Boom.isBoom(err)) {
    return res.status(err.output.statusCode).json({
      statusCode: err.output.statusCode,
      error: err.output.payload.error,
      message: err.message,
      details: err.data?.details || null,
    });
  }

  res.status(500).json({
    statusCode: 500,
    error: "Internal Server Error",
    message: err.message,
  });

  app.use(errorHandler);
});

module.exports = app;
