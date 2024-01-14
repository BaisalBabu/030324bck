const mongoose = require("mongoose");

const roomTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      unique: true, // Enforce uniqueness
      sparse: true, // Allow null values
      required: true,
    },
    display: {
      type: Boolean,
      default: true, // Set a default value if needed
      required: true,
    },
    // Add other fields related to room types if needed
  },
  {
    timestamps: true,
  }
);

const RoomTypeModel = mongoose.model("RoomType", roomTypeSchema);

module.exports = RoomTypeModel;
