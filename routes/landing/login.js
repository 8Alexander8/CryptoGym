const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/user");

router.get("/login", (req, res) => {
    res.render("login");
});
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        successFlash: "true",
        failureRedirect: "/login",
        failureFlash: true,
        logedIn: true
    }),
    (req, res) => {

    }
);

module.exports = router;