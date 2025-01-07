const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.Secret;
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ error: "No token provided" });
  }
  try {
    const data = jwt.verify(token.trim(), JWT_SECRET);
    req._id = data.user._id;
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token" });
  }
};

module.exports = fetchUser;
