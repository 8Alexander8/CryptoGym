const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    symbol: String,
    name: String,
    price: Number,
    addedAt: String,
    amount: Number,
    positionValue: Number,
    currentPrice: Number,
    totalPL: Number
})

module.exports = mongoose.model("Portfolio", portfolioSchema);