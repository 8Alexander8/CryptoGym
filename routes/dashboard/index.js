const express = require("express");
const router = express.Router();
const Middleware = require("../../middleware/index");
const apiCall = require("../../api/index");
const User = require("../../models/user");
const Portfolio = require("../../models/portfolio");
const Watchlist = require("../../models/watchlist");


//Show Dashboard main page
router.get("/", Middleware.isLoggedIn, async (req, res) => {
  console.log(req.user)
  const data = await apiCall.cryptoApi();
  Portfolio.find({
    "user.id": req.user._id
  }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let counter = 0;
      let total_PL = 0;
      let positionsValue = 0;

      //Get all coins from API Call, then find the price of each portfolio coin.
      let coins = apiCall.cryptoApi();
      data.forEach(element => {
        coins.forEach(coin => {
          if (element.name == coin.id) {
            counter++;
            let price = parseFloat(coin.priceUsd).toFixed(2);
            element.positionValue = parseFloat(element.amount * price).toFixed(2);
            element.currentPrice = price;
            element.totalPL = parseFloat((element.amount * price) - (element.amount * element.price)).toFixed(2);
            total_PL += element.totalPL;
            positionsValue += element.positionValue;

          }
        })
      });
      User.findById(req.user._id, async (err, user) => {
        if (err) {
          res.send(err)
        } else {
          user.portfolioValue = parseFloat(user.capital + positionsValue).toFixed(2);
          await user.save()
          if (total_PL < 0) {
            user.capital = parseFloat(user.capital - total_PL).toFixed(2);
            user.save()
          } else {
            user.profit = parseFloat(total_PL).toFixed(2)
            user.save()
          }

        }
      })
    }
  })

  //   apiCall.stockExchangeMarkets();
  res.render("dashboard/index", {
    json_data: data,
  });
});

//Show Chart page
router.get("/chart", Middleware.isLoggedIn, (req, res) => {
  console.log(req.query.coin);
  //   apiCall.stockExchangeMarkets();
  let coin = "";

  if (req.query.coin) {
    coin = req.query.coin;
  } else {
    coin = "BTC";
  }
  res.render("dashboard/chart", {
    coin: coin,
  });
});
//Show Chart page
router.get("/news", Middleware.isLoggedIn, async (req, res) => {
  const data = await apiCall.newsData();
  //   apiCall.stockExchangeMarkets();
  res.render("dashboard/news", {
    newsData: data,
  });
});

//Add coin to watchlist
router.post("/watchlist_add", Middleware.isLoggedIn, (req, res) => {
  User.findById(req.body.user_id, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/dashboard");
    } else {
      let current_datetime = new Date();
      let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
      //Data from AJAX call
      let watchlist = {
        symbol: req.body.crypto_symbol,
        name: req.body.crypto_name,
        price: parseFloat(
          apiCall.cryptoPriceBySymbol(req.body.crypto_name)
        ).toFixed(2),
        addedAt: formatted_date,
      };

      Watchlist.create(watchlist, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          data.user.id = req.body.user_id;
          data.save();
          user.watchlistArr.push(data);
          console.log(data);
          res.send(data);
        }
      });
    }
  });
});

router.get("/leaderboard", async (req, res) => {
  const users = await User.find({}, (err, users) => {
    let userMap = {};
    users.forEach((user) => {
      userMap[user._id] = user;
    });

    return userMap;
  });

  res.render("dashboard/leaderboard", {
    users: users
  });
});

//Logout

router.get("/logout", (req, res) => {
  req.logOut()
  res.redirect("/")
})


module.exports = router;