const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  maxParticipants: { type: Number, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model("Team", teamSchema);
