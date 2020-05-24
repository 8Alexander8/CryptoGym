const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    symbol: String,
    name: String,
    price: Number,
    addedAt: String
})

module.exports = mongoose.model("Watchlist", watchlistSchema);