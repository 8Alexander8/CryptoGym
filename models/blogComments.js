const mongoose = require("mongoose");

const BlogComment = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    text: String,
    user_image: String,
    createdAt: String
})

module.exports = mongoose.model("BlogComments", BlogComment)