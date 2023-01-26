const mongoose = require('mongoose')

const deskSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    coords:{
        angle: String,
        x : String,
        y : String
    },
    officeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'office'
    },
    floorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'floor'
    },
    date: {type:Date, default:Date.now}
})

const Desk = mongoose.model('desk', deskSchema)

module.exports = Desk
module.exports.deskSchema = deskSchema