const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/userRoutes");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/api/users", userRoutes);
// app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

