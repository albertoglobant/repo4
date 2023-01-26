const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const role = require('../helpers/role')
const JWTSECRET = 'Gdesk-gidPlus-87;9'

const userSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    name:{
        type: String,
        required: true,
        trim: true
    },
    family_name:{
        type: String,
    },
    picture:{
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: role.User
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    date: {type:Date, default:Date.now}
})

userSchema.methods.generateJWT = function(){
    return jwt.sign({
        _id: this._id,
        name: this.name,
        companyId: this.companyId,
        role: this.role
    }, JWTSECRET)
}

const User = mongoose.model('user', userSchema)

module.exports = User