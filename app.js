const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const authRoutes = require("./src/routes/authRoutes")
const stickerRoutes = require("./src/routes/stickerRoutes")

const app = express()

app.use(helmet())

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())
app.use(morgan("dev"))
app.use("/api/auth", authRoutes)
app.use("/api/stickers", stickerRoutes)

app.get("/", (req, res) => {
  res.json({ message: "API Running" })
})

// const { protect } = require("./src/middlewares/authMiddleware")

// app.get("/api/test-protected", protect, (req, res) => {
//   res.json({
//     message: "You accessed protected route",
//     user: req.user
//   })
// })

module.exports = app