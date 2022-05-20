const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
    gameid: String,
    start: Number,
    encryptsecret:String ,
    winner: String,
    price: Number,
    tokenid:Number
});


const Game = mongoose.model('Gamessss', gameSchema);
module.exports = Game;