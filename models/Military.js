const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MilitarySchema = new Schema({
<<<<<<< HEAD
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    middleName: {
=======
    name: {
>>>>>>> 9fc1edf16f5309420043d7fdcce1a953f34d3379
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
<<<<<<< HEAD
    phone:{
        type:String,
        required:true
    },
    contract: { 
        type: Number,
         required: true 
    },
=======
>>>>>>> 9fc1edf16f5309420043d7fdcce1a953f34d3379
    createdBy: { // Добавляем поле createdBy
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
<<<<<<< HEAD
}, { timestamps: true });
=======
});
>>>>>>> 9fc1edf16f5309420043d7fdcce1a953f34d3379

module.exports = mongoose.model('Military', MilitarySchema);
