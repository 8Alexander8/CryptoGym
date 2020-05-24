const express = require("express");
const router = express.Router();
const Middleware = require("../../middleware/index");
const User = require("../../models/user");
const Portfolio = require("../../models/portfolio");
const apiCall = require("../../api/index");

//Show Dashboard main page
router.get("/", Middleware.isLoggedIn, (req, res) => {
    //find watchlist based on the user id
    Portfolio.find({
        "user.id": req.user._id
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let counter = 0;
            let total_PL = 0;
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
                    }
                })
            });
            res.render("dashboard/portfolio", {
                data: data,
                openPositions: counter,
                total_PL: parseFloat(total_PL).toFixed(2)
            })
        }
    })
});

//Add Position to Portfolio
router.post("/buy", Middleware.isLoggedIn, (req, res) => {
    User.findById(req.body.user_id, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            let price = parseFloat(apiCall.cryptoPriceBySymbol(req.body.crypto_name)).toFixed(2);
            if (user.capital > 0 && user.capital > (req.body.amount * price)) {
                let current_datetime = new Date()
                let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
                let position = {
                    symbol: req.body.crypto_symbol,
                    name: req.body.crypto_name,
                    price: price,
                    addedAt: formatted_date,
                    amount: req.body.amount
                };
                Portfolio.create(position, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        data.user.id = req.body.user_id;
                        data.save();
                        user.capital = user.capital - (data.amount * data.price);
                        user.save();
                        console.log(data);
                        res.send({
                            data: data,

                        });
                    }
                })
            } else {
                res.send({
                    error: "Insufficient Funds"
                })
            }

        }
    })
});

//Close position (Sell)
router.post("/sell", (req, res) => {
    User.findById(req.body.user_id, (err, user) => {
        if (err) {
            console.log(err);
        } else {

            let price = parseFloat(apiCall.cryptoPriceBySymbol(req.body.crypto_name)).toFixed(2);
            Portfolio.findById(req.body.position_id, (err, position) => {

                if (position.user.id == req.body.user_id) {

                    if (position.amount > req.body.amount) {
                        console.log(req.body.user_id)
                        user.capital = user.capital + ((req.body.amount * price))
                        user.save();
                        position.amount = position.amount - req.body.amount;
                        position.save();
                        res.send(position)

                    } else if (position.amount == req.body.amount) {
                        user.capital = user.capital + ((req.body.amount * price))
                        user.save();
                        position.remove();
                        res.send({
                            remove: true
                        })
                    }
                } else {
                    res.send({
                        error: "Somthing went worng"
                    })

                }

            })
        }
    })
})


router.get("/getCoin", (req, res) => {
    if (req.body.coin) {
        res.send({
            coinPrice: apiCall.cryptoPriceBySymbol(req.body.coin)
        })
    }
})


module.exports = router;