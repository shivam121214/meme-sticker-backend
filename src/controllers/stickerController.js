const Sticker = require("../models/Sticker")
const cloudinary = require("../config/cloudinary")
const { fileTypeFromBuffer } = require("file-type")

exports.uploadSticker = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const allowedTypes = ["image/png", "image/webp"]

    const fileType = await fileTypeFromBuffer(req.file.buffer)

    if (!fileType || !allowedTypes.includes(fileType.mime)) {
      return res.status(400).json({ message: "Only PNG or WebP allowed" })
    }

    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: "stickers" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Cloudinary upload failed" })
        }

        const sticker = await Sticker.create({
          title: req.body.title,
          imageUrl: result.secure_url,
          cloudinaryId: result.public_id,
          uploader: req.user._id,
          tags: req.body.tags ? req.body.tags.split(",") : []
        })

        res.status(201).json({
          message: "Sticker uploaded",
          sticker
        })
      }
    )

    uploadResult.end(req.file.buffer)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

exports.getStickers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const skip = (page - 1) * limit

    const stickers = await Sticker.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Sticker.countDocuments()

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      stickers
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

exports.getStickerById = async (req, res) => {
  try {
    const sticker = await Sticker.findById(req.params.id)

    if (!sticker) {
      return res.status(404).json({ message: "Sticker not found" })
    }

    res.json(sticker)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}