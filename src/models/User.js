const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  downloadsToday: {
    type: Number,
    default: 0
  },
  downloadResetAt: {
    type: Date,
    default: Date.now
  },
  uploadsCount: {
    type: Number,
    default: 0
  },
  favouritesCount: {
    type: Number,
    default: 0
  },
  isBanned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", userSchema)