const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    deskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'desk'
    },
    officeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'office'
    },
    floorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'floor'
    },
    bookingDate: {type: Date},
    date: {type: Date, default:Date.now}
})

const Booking = mongoose.model('booking', bookingSchema)

module.exports = Booking