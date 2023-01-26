const mongoose = require('mongoose')

const floorSchema = new mongoose.Schema({
    officeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'office'
    },
    name: {
        type: String,
        require: true,
        minlength: 1,
        maxlength: 99,
        trim: true
    },
    imageUrl: String,
    desks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'desk'
    }],
    date: {type: Date, default: Date.now}
}) 

const Floor = mongoose.model('floor', floorSchema)

module.exports = Floor