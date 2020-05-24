const express = require("express");
const router = express.Router();
const Middleware = require("../../middleware/index");
const User = require("../../models/user");
const Watchlist = require("../../models/watchlist");
const apiCall = require("../../api/index");

//Show Dashboard main page
router.get("/", Middleware.isLoggedIn, (req, res) => {
    //find watchlist based on the user id
    Watchlist.find({
        "user.id": req.user._id
    }, (err, data) => {
        console.log(data)
        res.render("dashboard/watchlist", {
            data: data,
            crypto_data: apiCall.cryptoApi()
        })
    })

});

router.delete("/delete", Middleware.isLoggedIn, (req, res) => {
    Watchlist.findByIdAndRemove(req.body.watchlist_id, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Coin Deleted Successfuly");

        }
    })
})


module.exports = router;