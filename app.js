const express = require("express");
const app = express();
const chalk = require("chalk");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const flash = require("connect-flash");
const utf8 = require("utf8");

//Requiring routes
const indexRoute = require("./routes/landing/index");
const signupRoute = require("./routes/landing/signup");
const loginRoute = require("./routes/landing/login");
const dashboardIndexRoute = require("./routes/dashboard/index");
const dashboardWatchlistRoute = require("./routes/dashboard/watchlist");
const dashboardPortfolioRoute = require("./routes/dashboard/portfolio");
const userRoute = require("./routes/dashboard/user");

//MongoDB Connect
mongoose.connect("mongodb://localhost:27017/stock_gym", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//App configuration
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(__dirname + "/public"));

//Passport Config
app.use(
  require("express-session")({
    secret: "This is a secrete text",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy({
      usernameField: "email",
    },
    User.authenticate()
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

//Local variable Config
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//using the routes
app.use(indexRoute);
app.use(signupRoute);
app.use(loginRoute);
app.use("/dashboard", dashboardIndexRoute);
app.use("/dashboard/watchlist", dashboardWatchlistRoute);
app.use("/dashboard/portfolio", dashboardPortfolioRoute);
app.use("/dashboard/user", userRoute);


//Server Listening
app.listen(3000, (err) => {
  console.log(chalk.green("Server is running on port 3000"));
});