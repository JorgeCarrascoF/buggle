const mongoose = require('mongoose');

const alertConfigSchema = new mongoose.Schema({
    name: String,
    project: Buffer,
    environment: String,
    thresholdCount: Number,
    createBy: Number,
    createAt: Date,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const AlertConfig = mongoose.model('AlertConfig', alertConfigSchema);
module.exports=AlertConfig;
