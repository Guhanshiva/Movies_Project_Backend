const express = require("express");
const db = require("./src/Config/db");
const router = require("./src/Routes/routes");
const passport = require("./src/Config/passport");
require("dotenv").config();

const app = express();
const cors = require("cors");
const port = 4000;
app.use(express.json());
app.use(passport.initialize());
app.use(cors());
app.use("/uploads", express.static("./src/uploads"));

app.use("/api", router);

const dbconnection = async () => {
  try {
    await db.authenticate();
    console.log("Database is Connected");
    await db.sync();
    console.log("Tables Created Successfully");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
};

dbconnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error starting the server:", err);
  });
