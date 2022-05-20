const mongoose = require('mongoose');



const studentSchema = new mongoose.Schema({
    address: String,
    gamespart: [String],
    winner:{type: [String],default :[]},
    nonce: String,
});


const Student = mongoose.model('Studentsss', studentSchema);
module.exports = Student