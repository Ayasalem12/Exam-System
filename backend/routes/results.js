const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middleware/auth");
const { getAllResults, getUserResults } = require("../controllers/results");

router.get("/admin", auth, restrictTo("admin"), getAllResults);
router.get("/student/:userId", auth, restrictTo("student"), getUserResults);

module.exports = router;
