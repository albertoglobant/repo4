const mongoose = require('mongoose')

const officeSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    name: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 99,
        trim: true
    },
    country: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 99,
        trim: true
    },
    imageUrl: String,
    address: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 99,
        trim: true
    },
    floor: String,
   // desk: {
   //     type: mongoose.Schema.Types.ObjectId,
   //     ref: 'desk'
   // },
    floors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'floor'
    }],
    desks: [{
        desk:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'desk'
        }
    }],
    date: {type: Date, default: Date.now}
}) 

const Office = mongoose.model('office', officeSchema)

module.exports = Office