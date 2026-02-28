const User = require("../models/User")
const jwt = require("jsonwebtoken")

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  )
}

exports.register = async (req, res) => {
console.log("Register route hit")
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const user = await User.create({
      username,
      email,
      password
    })

    const token = generateToken(user)

    res.status(201).json({
      message: "User registered",
      token
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user)

    res.json({
      message: "Login successful",
      token
    })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}