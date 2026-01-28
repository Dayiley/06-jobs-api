const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

router.get("/", authenticateUser, (req, res) => {
  res.status(200).json({
    msg: `Hello ${req.user.name}`,
    user: req.user,
  });
});

module.exports = router;
