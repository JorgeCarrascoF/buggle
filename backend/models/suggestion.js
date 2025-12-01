const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  report: { type: String, required: true },

  logId: { type: mongoose.Schema.Types.ObjectId, ref: 'Log', require: true },
  created_at: {
    type: Date,
    default: Date.now
  },
});

suggestionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.logId) {
      ret.log = ret.logId;
      delete ret.logId;
    }

    delete ret.__v;
    return ret;
  }
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);
module.exports = Suggestion;