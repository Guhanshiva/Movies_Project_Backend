const passport = require("passport");

const authenticateToken = () => async (req, res, next) => {
  try {
    // Wrapping the passport.authenticate in a Promise for async/await usage
    const verifyCallback = (req, resolve, reject) => (err, user, info) => {
      if (err || !user) {
        return reject(err || new Error("Unauthorized"));
      }
      req.user = user;

      // Check if the authenticated user's ID matches the requested user's ID from the query parameter
      if (req.query.id && req.user.id !== parseInt(req.query.id)) {
        return reject(new Error("Unauthorized"));
      }

      resolve(user);
    };

    // Authenticating the request with JWT strategy
    await new Promise((resolve, reject) => {
      const authenticate = passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject)
      );
      authenticate(req, res, resolve);
    });

    next(); // Proceed to the next middleware/controller if authentication is successful
  } catch (err) {
    // Handle errors
    if (err.message === "Unauthorized") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next(err);
  }
};

module.exports = authenticateToken;
