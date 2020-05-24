const express = require("express");
const router = express.Router();
const Middleware = require("../../middleware/index");
const multer = require("multer");
const User = require("../../models/user");
const fs = require('fs')

router.get("/", Middleware.isLoggedIn, (req, res) => {
    res.render("dashboard/user");
});


//-----------------------------------------------------Upload Image------------------------------------------------------
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};
const PATH = './public/assets/uploads/images';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log(file.mimetype);
        const mimeValid = MIME_TYPE_MAP[file.mimetype];
        if (!mimeValid) return cb("Only jpg/png/jpeg can be uploaded");
        cb(null, true);
    },
});
router.post(
    "/upload-image",
    upload.single("image"),
    (req, res) => {
        if (!req.file) {
            console.log("No file is available!");
            return res.send({
                success: false
            });

        } else {
            console.log('File is available!');
            User.findById(req.user._id, (err, user) => {
                if (user) {
                    if (user.image != "default.jpeg") {
                        fs.unlinkSync(PATH + "/" + user.image)
                    }
                    user.image = req.file.filename;
                    user.save();
                    res.redirect("/dashboard/user")
                }
            })
        }
    }
);
//-------------------------------------------------------End Upload Image---------------------------------------------------

module.exports = router;