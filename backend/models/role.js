const mongoose = require('../connections/db');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true
    },
    permission: {
        type: [String],
        required: [true, 'Permission is required']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);