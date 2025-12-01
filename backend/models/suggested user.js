const mongoose = require("mongoose");

const suggestedUserSchema = new mongoose.Schema({
  error_signature: {
    type: String,
    required: true,
    index: true
  },
  developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resolved_count: { type: Number, default: 0 },
  last_resolved_at: { type: Date, default: Date.now }
});

const SuggestedUser = mongoose.model("SuggestedUser", suggestedUserSchema);
module.exports = SuggestedUser;
