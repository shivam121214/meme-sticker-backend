const multer = require("multer")

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 }, // 500KB limit
})

module.exports = upload