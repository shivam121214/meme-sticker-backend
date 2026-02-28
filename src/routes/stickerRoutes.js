const express = require("express")
const router = express.Router()
const { uploadSticker, getStickers, getStickerById } = require("../controllers/stickerController")
const { protect } = require("../middlewares/authMiddleware")
const upload = require("../middlewares/uploadMiddleware")

router.get("/", getStickers)
router.get("/:id", getStickerById)
router.post("/upload", protect, upload.single("image"), uploadSticker)

module.exports = router