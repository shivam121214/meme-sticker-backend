const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.optionalProtect = async (req, res, next) => {
  try {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select("-password")

    if (user && !user.isBanned) {
      req.user = user
    }

    return next()

  } catch (error) {
    return next()
  }
}