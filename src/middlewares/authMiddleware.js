// authMiddleware.js
const jwt = require("jsonwebtoken");
require('dotenv').config()
const secretKey = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token de autorização não fornecido" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token de autorização inválido" });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
