const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MilitarySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rank: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    dateEnlisted: {
        type: Date,
        required: true
    },
    createdBy: { // Добавляем поле createdBy
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Military', MilitarySchema);
