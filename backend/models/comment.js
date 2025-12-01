const { boolean } = require('joi');
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  pinned: {
    type: Boolean,
    default: false
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  logId: { type: mongoose.Schema.Types.ObjectId, ref: 'Log' },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true
  }
});

commentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.userId) {
      ret.user = {
        id: ret.userId._id.toString(),
        email: ret.userId.email,
        fullName: ret.userId.fullName
      };
      delete ret.userId;
    }

    if (ret.logId) {
      ret.log = ret.logId;
      delete ret.logId;
    }

    delete ret.__v;
    return ret;
  }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;