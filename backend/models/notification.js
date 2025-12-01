const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    name: String,
    project: Buffer,
    environment: String,
    thresholdCount: Number,
    createBy: Number,
    createAt: Date,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    logId: {type: mongoose.Schema.Types.ObjectId, ref: 'Log'}

});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports=Notification;
