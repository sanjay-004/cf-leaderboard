const express = require("express");
const router = express.Router();
const {
    getLeaderboard,
    postUser,
    updUser,
    delUser,
    delAll
} = require('../controllers/leaderboardControllers');

router.route("/").get(getLeaderboard).post(postUser).delete(delAll);
router.route("/:id").put(updUser).delete(delUser);
module.exports = router;