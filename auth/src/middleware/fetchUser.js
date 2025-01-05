const jwt = require("jsonwebtoken");

const JWT_SECRET = "ajayMali";
const fetchUser = async(req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    res.status(401).send({ error: "No token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req._id = data.user._id;
    next();
  } catch (error) {
    res.status(401).send({ error });
  } 
};
module.exports = fetchUser;
