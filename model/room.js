const mongoose = require("mongoose");

const roomschema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    maxcount: {
      type: Number,
      required: true,
    },

    conditioning: {
      type: String,
      required: true,
    },

    rentperday: {
      type: Number,
      required: true,
    },

    imagefile1: {
      data: {
        type: Buffer,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
    },

    imagefile2: {
      data: {
        type: Buffer,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
    },

    imagefile3: {
      data: {
        type: Buffer,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
    },

    currentbookings: [],

    type: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    count: {
      type: Number,
      required: true,
      default: 0,
    },

    display: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const roomModel = mongoose.model("rooms", roomschema);

module.exports = roomModel;
