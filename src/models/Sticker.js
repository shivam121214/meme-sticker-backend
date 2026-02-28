const mongoose = require("mongoose")

const stickerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  tags: [String],
  downloads: {
    type: Number,
    default: 0
  },
  likesCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

stickerSchema.index({ title: "text", tags: "text" })

module.exports = mongoose.model("Sticker", stickerSchema)