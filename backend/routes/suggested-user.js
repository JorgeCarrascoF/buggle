const express = require("express");
const router = express.Router();
const suggestedUserController = require("../controllers/suggestedUserController");
const { authMiddleware } = require("../middleware/auth");

router.get(
  "/:error_signature",
  authMiddleware,
  suggestedUserController.getSuggestions
);

module.exports = router;
