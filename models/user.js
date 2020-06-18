const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  nickname: String,
  password: String,
  createdAt: Date,
  capital: Number,
  profit: Number,
  portfolioValue: Number,
  image: String,
  watchlistArr: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Watchlist"
  }],
  portfolioArr: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Portfolio"
  }]
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("User", userSchema);