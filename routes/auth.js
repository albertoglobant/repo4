const bcrypt = require('bcrypt')
const mongosee = require('mongoose')
const express = require('express')
const User = require('../models/user')
const {Company} = require('../models/company')
const router = express.Router()
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client("25689160748-dp0k48972c449ruqc0dpbkhcj4cbpe9f.apps.googleusercontent.com")
const { check, validationResult } = require('express-validator');

router.post('/', [
    check('email').isLength({min: 3}),
    check('password').isLength({min: 3}),
],async(req, res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let user = await User.findOne({email: req.body.email})
        if(!user) return res.status(400).send({'error': 'User or password incorrect'})

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(!validPassword) return res.status(400).send({'error': 'User or password incorrect'})
        let jwtToken = user.generateJWT();
        jwtToken = 'Bearer ' + jwtToken

        res.status(200).header('Authorization', jwtToken).send({
            _id: user._id,
            name: user.name,
            companyId: user.companyId,
            role: user.role,
            email: user.email,
            picture: user.picture,
            token: jwtToken 
        })
    }catch(error){
        console.log("Error POST api/auth/")
        console.log(error)
        res.status(400).send(error)
    }
})

router.post('/google-login',async(req, res)=>{
    try{
        const token = req.body.token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "25689160748-dp0k48972c449ruqc0dpbkhcj4cbpe9f.apps.googleusercontent.com"
        })
        const payload = ticket.getPayload();
        if(!payload){
            return res.status(400).send({error: "You can not login with google"})
        }
        let user = await User.findOne({email: payload.email})
        if(user) {
            console.log("User already register by google")
            let jwtToken = user.generateJWT();
            jwtToken = 'Bearer ' + jwtToken
    
            return res.status(200).header('Authorization', jwtToken).send({
                _id: user._id,
                name: user.name,
                companyId: user.companyId,
                role: user.role,
                email: user.email,
                picture: user.picture,
                token: jwtToken 
            })   
        }else {
            console.log("New register user by google")
            var companyId = ""
            const space = payload.email.split("@")[1]
            var company = await Company.findOne({space: space})
            if(!company) return res.status(400).send({'error': 'For Register a new User you need to have a email for a company in our DataBase'})
            companyId = company._id
    
            const user = new User({
                companyId: companyId,
                name: payload.given_name,
                family_name: payload.family_name,
                picture: payload.picture,
                email: payload.email,
                password: "--fsdf.sdfs4343"
            })
            const result = await user.save()
            let jwtToken = user.generateJWT()
            jwtToken = 'Bearer ' + jwtToken

            return res.status(200).header('Authorization', jwtToken).send({
                _id: user._id,
                name: user.name,
                companyId: user.companyId,
                role: user.role,
                space: space,
                picture: user.picture,
                token: jwtToken
            })
        }
    }catch(error){
        console.log(error)
        return res.status(400).send({error: "You can not login/register with google at this time"})
    }
})

module.exports = router