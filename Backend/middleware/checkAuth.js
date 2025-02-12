const jwt = require("jsonwebtoken");

// Middleware to check authentication
const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
    req.user = decodedToken; // Add decoded user info to the request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { checkAuth };
