const mongoose = require("mongoose");

const WorkerProfileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide full name"],
      trim: true,
      maxlength: 100,
    },
    positionType: {
      type: String,
      enum: ["driver", "mechanic", "dispatcher", "safety", "other"],
      required: [true, "Please provide position type"],
    },
    yearsExperience: {
      type: Number,
      required: [true, "Please provide years of experience"],
      min: 0,
      max: 60,
    },
    state: {
      type: String,
      required: [true, "Please provide state"],
      uppercase: true,
      minlength: 2,
      maxlength: 2,
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkerProfile", WorkerProfileSchema);
