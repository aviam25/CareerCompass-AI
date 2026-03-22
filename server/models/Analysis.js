const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skills: [String],
    bestRole: {
      role: String,
      score: Number,
    },
    match: {
      type: Map,
      of: new mongoose.Schema(
        {
          score: String,
          missing: [String],
        },
        { _id: false }
      ),
    },
    resumeName: {
      type: String,
      default: "resume.pdf",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);