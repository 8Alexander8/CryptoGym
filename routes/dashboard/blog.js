const express = require("express");
const joi = require("@hapi/joi");
const router = express.Router();
const Middleware = require("../../middleware/index");
const User = require("../../models/user");
const BlogPost = require("../../models/blogPost");
const BlogComments = require("../../models/blogComments");

//get all post and show them on the page
router.get("/", Middleware.isLoggedIn, (req, res) => {
    BlogPost.find().populate("comments").exec((error, allBlogPost) => {
        if (error) {
            console.log(error)
        } else {
            console.log(allBlogPost)
            res.render("dashboard/blog/blog", {
                posts: allBlogPost
            })
        }
    })
})
//New post - show form to create new post
router.get("/post", Middleware.isLoggedIn, (req, res) => {
    res.render("dashboard/blog/post")
})

router.post("/", Middleware.isLoggedIn, (req, res) => {
    const {
        error
    } = validatePost(req.body);
    if (error)
        return res.render("dashboard/blog/post", {
            error: error.details[0].message,
        });
    let user = {
        id: req.user._id,
        username: req.user.nickname
    };
    let title = req.body.title;
    let post = req.body.post;
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
    let createdAt = formatted_date;
    let image = req.user.image
    let newPost = {
        user: user,
        title: title,
        post: post,
        createdAt: createdAt,
        user_image: image
    };
    BlogPost.create(newPost, (err, newlyCreated) => {
        if (err) {
            console.log(err)
        } else {
            console.log(newlyCreated)
            res.redirect("/dashboard/blog")
        }
    })

})
//post comment
router.post("/comment", Middleware.isLoggedIn, (req, res) => {

    const {
        error
    } = validateComment(req.body);
    if (error) return res.redirect("/dashboard/blog")

    let comment = req.body.comment;
    let user_image = req.body.user_image;
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
    let createdAt = formatted_date;

    let newComment = {
        text: comment,
        user_image: user_image,
        createdAt: createdAt
    }

    BlogPost.findById(req.body.post_id, (err, post) => {
        if (err) {
            console.log(err)
            res.redirect("/dashboard/blog")
        } else {
            BlogComments.create(newComment, (err, comment) => {
                if (err) {
                    console.log(err)
                } else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.nickname
                    comment.save()
                    post.comments.push(comment)
                    post.save();
                    console.log(comment);
                    res.send(comment)
                }
            })
        }
    })

})

//Delete Blog Post
router.delete("/delete", checkPostOwnership, (req, res) => {

    BlogPost.findByIdAndRemove(req.body.post_id, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.send("Post Deleted")
        }
    })
})


//JOI post validation
function validatePost(post) {
    const schema = joi.object({
        title: joi.string().min(2).max(255).required(),
        post: joi.string().min(2).max(5000),
    });
    return schema.validate(post);
}

//JOI comment validation
function validateComment(comment) {
    const schema = joi.object({
        user_image: joi.string(),
        user_nickname: joi.string(),
        post_id: joi.string(),
        comment: joi.string().min(2).max(5000).required(),

    });
    return schema.validate(comment);
}

//Check Post ownership

function checkPostOwnership(req, res, next) {
    if (req.isAuthenticated()) {

        BlogPost.findById(req.body.post_id, (err, foundPost) => {
            if (err) {
                console.log(err)
            } else {
                if (foundPost.user.id.equals(req.user._id)) {
                    next()
                } else {
                    redirect("back")
                }
            }
        })
    } else {
        redirect("back")
    }
}

module.exports = router;