const { required } = require('joi');
const mongoose = require('mongoose');

const statusRegisterSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['unresolved', 'in review', 'solved'],
        default: 'unresolved'
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    logId : { type: mongoose.Schema.Types.ObjectId, ref: 'Log' },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
},
    { timestamps: false });

const StatusRegister = mongoose.model('StatusRegister', statusRegisterSchema);
module.exports = StatusRegister;
