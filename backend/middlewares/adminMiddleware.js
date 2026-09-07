const jwt = require("jsonwebtoken");

exports.adminMiddleware = (req, res, next) => {
  try {
    const adminHeaders = req.headers.authorization;

    if (!adminHeaders || !adminHeaders.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Token required" });
    }

    const token = adminHeaders.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.adminId = decoded.adminId; // attach adminId to request
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};