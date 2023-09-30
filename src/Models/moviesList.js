const { Sequelize } = require("sequelize");
const db = require("../Config/db");

const MoviesList = db.define(
  "movieslist",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    releaseYear: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    director: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    writers: {
      type: Sequelize.STRING, // Array of strings for multiple writers
      allowNull: true,
    },
    stars: {
      type: Sequelize.STRING, // Array of strings for multiple stars
      allowNull: true,
    },
    category: {
      type: Sequelize.ENUM(
        "Action",
        "Adventure",
        "Comedy",
        "Drama",
        "Fantasy",
        "Sci-Fi",
        "Thriller",
        "Biography",
        "Horror",
        "Other"
      ),
      allowNull: true,
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    movieImage: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    duration: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "movieslist", // Specify the custom table name here
  }
);

module.exports = MoviesList;
