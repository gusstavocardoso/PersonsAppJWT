const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/users", authenticateToken, userController.listUsers);
router.get("/user/:id", authenticateToken, userController.getUserById);
router.put("/update/:id", authenticateToken, userController.updateUser);
router.delete("/delete/:id", authenticateToken, userController.deleteUser);

module.exports = router;
