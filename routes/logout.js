const express = require("express");
const router = express.Router();
const { handleLogOut } = require("../controllers/logOutController");

router.get("/", handleLogOut);

module.exports = router;
