const { Sequelize } = require("sequelize");

const db = new Sequelize("Movies", "root", "", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
  port: 3306,
});
module.exports = db;
