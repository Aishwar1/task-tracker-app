const express = require("express");
const router = express.Router();

const authMiddleware = require(
    "../middleware/authMiddleware"
);

const {
    startTimer,
    stopTimer,
    getLogs
} = require(
    "../controllers/timeLogController"
);

router.post(
    "/start",
    authMiddleware,
    startTimer
);

router.post(
    "/stop",
    authMiddleware,
    stopTimer
);

router.get(
    "/",
    authMiddleware,
    getLogs
);

module.exports = router;