const StatusRegister = require("../models/status register");
const Log = require("../models/log");
const SuggestedUser = require("../models/suggested user");
const mongoose = require("mongoose");

class SuggestedUserService {

  async trackResolution(logId) {
    if (!mongoose.Types.ObjectId.isValid(logId)) {
      throw new Error("Invalid logId");
    }

    //const log = await Log.findById(logId);
    const log = await Log.findById(logId).populate("assigned_to", "_id fullName email");


    if (!log) throw new Error("Log not found");

    // logs automáticos con error_signature
    if (log.status === "solved" && log.error_signature && log.assigned_to) {
      await SuggestedUser.findOneAndUpdate(
        { error_signature: log.error_signature, developerId: log.assigned_to },
        {
          $inc: { resolved_count: 1 },
          $set: { last_resolved_at: new Date() }
        },
        { upsert: true, new: true }
      );
    }
  }


  async getSuggestionsByErrorSignature(error_signature, limit = 3) {
    const suggestions = await SuggestedUser.find({ error_signature })
      .populate("developerId", "fullName email role")
      .sort({ resolved_count: -1 })
      .limit(limit);

    return suggestions.map(s => ({
      userId: s.developerId?._id,
      name: s.developerId?.fullName,
      email: s.developerId?.email,
      role: s.developerId?.role,
      resolved_count: s.resolved_count,
      last_resolved_at: s.last_resolved_at
    }));
  }
}

module.exports = new SuggestedUserService();