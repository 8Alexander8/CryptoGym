const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogComments"

    }],
    title: String,
    post: String,
    createdAt: String,
    user_image: String
})

module.exports = mongoose.model("BlogPost", postSchema)