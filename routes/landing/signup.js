const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const passport = require("passport");
const joi = require("@hapi/joi");
const swal = require("sweetalert2");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const {
    error
  } = validateSignup(req.body);
  if (error)
    return res.render("signup", {
      error: error.details[0].message,
    });
  let user = await User.findOne({
    nickname: req.body.nickname
  });
  if (user) return res.render("signup", {
    error: "Nickname already exist"
  })

  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    nickname: req.body.nickname,
    createdAt: Date.now(),
    capital: 50000,
    image: "default.jpeg"
  });

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      //Passport Js uses email field as username field so we change the error message to be Email already registered
      if (err.message == "A user with the given username is already registered") {
        return res.render("signup", {
          error: "A user with the given Email is already registered",
        });
      } else {
        return res.render("signup", {
          error: err.message,
        });
      }

    }
    passport.authenticate("local")(req, res, function () {
      console.log("User " + user.username + " Added Successfuly");
      res.render("login", {
        success: user.username,
      });
    });
  });
});

function validateSignup(user) {
  const schema = joi.object({
    username: joi.string().min(2).max(255).required(),
    name: joi.string(),
    nickname: joi.string().min(2).max(255),
    email: joi.string().min(6).max(255).required().email(),
    password: joi.string().min(6).max(1024).required(),
  });
  return schema.validate(user);
}

module.exports = router;