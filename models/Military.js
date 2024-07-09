const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MilitarySchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    middleName: {
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
    phone:{
        type:String,
        required:true
    },
    contract: { 
        type: Number,
         required: true 
    },
    createdBy: { // Добавляем поле createdBy
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Military', MilitarySchema);
