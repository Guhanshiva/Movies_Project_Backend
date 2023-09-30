const express = require("express");
const securityController = require("../Controller/userController");
const auth = require("../middleWare/authmiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Use an absolute path for the destination directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Use a unique filename to avoid overwriting existing files
  },
});
const upload = multer({ storage });

const {
  createUserRegistration,
  loginValidation,
} = require("../validation/securityvalidation");

const router = express.Router();

router.post(
  "/createUser",
  createUserRegistration,
  securityController.createUser
);
router.post("/login", loginValidation, securityController.login);
router.get("/getlist", auth(), securityController.getList);
router.get("/searchMovies", auth(), securityController.searchMovies);
router.post(
  "/moviesCreate",
  auth(),
  upload.single("movieImage"),
  securityController.moviesListRegistration
);
router.get("/movies/:category", securityController.getMoviesByCategory);

module.exports = router;
