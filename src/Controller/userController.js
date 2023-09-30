const userDbModel = require("../models/user");
const moviesDdModel = require("../Models/moviesList");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function createUser(req, res) {
  const userData = req.body;

  try {
    const userWithEmail = await userDbModel.findOne({
      where: { emailId: userData.emailId },
    });
    const userWithPhoneNumber = await userDbModel.findOne({
      where: { phoneNumber: userData.phoneNumber },
    });

    if (userWithEmail) {
      return res.status(200).json({ message: "Email Already Registered" });
    } else if (userWithPhoneNumber) {
      return res
        .status(200)
        .json({ message: "Phone Number Already Registered" });
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const createdUser = await userDbModel.create({
        ...userData,
        password: hashedPassword,
      });
      console.log("User created successfully:", createdUser);
      return res
        .status(200)
        .json({ message: "Account Created Successfully", userData });
    }
  } catch (error) {
    console.error("Failed to create user:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
}

async function login(req, res) {
  try {
    const loginDetails = req.body;
    const emailVerification = await userDbModel.findOne({
      where: { emailId: loginDetails.emailId },
    });

    if (!emailVerification) {
      return res.status(200).json({ message: "Invalid Email Id Entered" });
    }

    if (
      !(await bcrypt.compare(loginDetails.password, emailVerification.password))
    ) {
      return res.status(200).json({ message: "Invalid Password Entered" });
    }

    const payload = { id: emailVerification.id };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "5h",
    });

    return res.status(200).json({
      message: "Login Successful",
      token,
      userDetails: emailVerification,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to Login" });
  }
}
async function getList(req, res) {
  try {
    const userId = req.query.id;

    const userDetails = await userDbModel.findByPk(userId);

    if (userDetails) {
      res.status(200).json({ user: userDetails });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function searchMovies(req, res) {
  try {
    const movieQuery = req.query.moviesName;
    const users = await moviesDdModel.findAll({
      where: {
        title: {
          [Op.like]: `%${movieQuery}%`,
        },
      },
    });

    if (users.length > 0) {
      res.status(200).json({ users: users });
    } else {
      res.status(404).json({ error: "No Movies Found" });
    }
  } catch (error) {
    console.error("Error finding movies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function moviesListRegistration(req, res) {
  try {
    const starsArray = req.body.stars ? req.body.stars : null;

    const {
      title,
      description,
      releaseYear,
      director,
      writers,
      stars,
      category,
      rating,
      movieImage,
      // topCast,
      duration,
    } = req.body;
    const movie = await moviesDdModel.create({
      title,
      description,
      releaseYear,
      director,
      writers,
      stars: starsArray,
      category,
      rating,
      movieImage,
      duration,
      // topCastImages,
    });

    res.status(200).json(movie);
  } catch (error) {
    console.error("Error creating movie:", error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getMoviesByCategory(req, res) {
  try {
    const { category } = req.params;

    const validCategories = [
      "Action",
      "Adventure",
      "Comedy",
      "Drama",
      "Fantasy",
      "Sci-Fi",
      "Thriller",
      "Biography",
      "Horror",
      "Other",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const movies = await moviesDdModel.findAll({
      where: { category },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    res.status(200).json(movies);
  } catch (error) {
    console.error("Error getting movies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = {
  createUser,
  login,
  getList,
  searchMovies,
  moviesListRegistration,
  getMoviesByCategory,
};
