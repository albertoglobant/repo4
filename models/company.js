const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        minlength: 1,
        maxlength: 99
    },
    country: String,
    space: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        default: 'globant.com'
    },
    date: {type:Date, default:Date.now}
})

const Company = mongoose.model('company', companySchema)

module.exports.Company = Company
module.exports.companySchema = companySchema