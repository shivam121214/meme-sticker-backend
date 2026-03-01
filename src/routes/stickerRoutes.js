const express = require("express")
const router = express.Router()
const { uploadSticker, getStickers, getStickerById, downloadSticker } = require("../controllers/stickerController")
const { protect } = require("../middlewares/authMiddleware")
const { optionalProtect } = require("../middlewares/optionalAuthMiddleware")
const upload = require("../middlewares/uploadMiddleware")

router.get("/", getStickers)
router.get("/:id", getStickerById)
router.post("/upload", protect, upload.single("image"), uploadSticker)
router.post("/:id/download", optionalProtect, downloadSticker)

module.exports = router