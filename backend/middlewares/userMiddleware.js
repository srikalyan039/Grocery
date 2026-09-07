const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.userMiddleware = async (req, res, next) => {
  try {
    const userHeader = req.headers.authorization;

    if (!userHeader || !userHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Token required" });
    }

    const token = userHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Matches both _id (from userController) and id
    const userId = decoded._id || decoded.id;
    const user = await User.findById(userId).select("-otp -otpExpires");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = user; // attach user object to request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired" });
    }
    return res.status(401).json({ msg: "Invalid token" });
  }
};