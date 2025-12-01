const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
    name: String,
    description: String,
    responsibleTeam: String,
    thresholdCount: Number,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

const Component = mongoose.model('Components', componentSchema);
module.exports=Component;
