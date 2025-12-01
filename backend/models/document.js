const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    log: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Log',
        required: [true, 'Log is required']
    }
}, {
    timestamps: true
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
