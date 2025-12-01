require("dotenv").config();
require("./instrument.js"); // Sentry lo más arriba posible

const app = require("./app");
require("./connections/db");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  //console.log(`📘 Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`);
});
