// Model for users in the database
// TODO: add validation
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: true,
    unique: true
  },
  password: {
    type: String, 
    required: true,
  },
  roles: 
    {
      type: [String],
      default: ["user"]
    },
  active: {
    type: Boolean,
    default: true
  }
})

const User = mongoose.model("User", userSchema)

module.exports = User
