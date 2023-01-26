const auth = require('../middleware/auth')
const autorize = require('../middleware/role')
const Role = require('../helpers/role')
const bcrypt = require('bcrypt')
const mongosee = require('mongoose')
const express = require('express')
const User = require('../models/user')
const {Company} = require('../models/company')
const router = express.Router()
const { check, validationResult } = require('express-validator');

router.get('/', [auth, autorize([Role.Admin])], async(req, res)=> {
    try{
        console.log(req.user.companyId)
        const users = await User.find({companyId: req.user.companyId})
            .populate('companyId', 'name')
            .select({name: 1, email: 1, role: 1})
        res.send(users)
    }catch(error){
        console.log("Error GET api/user/")
        console.log(error)
        res.status(400).send(error)
    }
})

//not use
router.get('/:id', async(req, res)=>{
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).send('This user does not exist')
    res.send(user)
})

router.post('/', [
    check('name').isLength({min: 3}),
    check('email').isLength({min: 3}),
    check('password').isLength({min: 3}),
],async(req, res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let user = await User.findOne({email: req.body.email})
        if(user) return res.status(400).send({'error': 'This user does already exist'})
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        var companyId =  req.body.companyId
        const space = req.body.email.split("@")[1]
        if(!req.body.companyId){
            console.log(space)
            var company = await Company.findOne({space: space})
            if(!company) return res.status(400).send({'error': 'For Register a new User you need to have a email for a company in our DataBase'})
            companyId = company._id
        }

        console.log(companyId)
        user = new User({
            companyId: companyId,
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        })
        const result = await user.save()
        let jwtToken = user.generateJWT()
        jwtToken = 'Bearer ' + jwtToken

        res.status(200).header('Authorization', jwtToken).send({
            _id: user._id,
            name: user.name,
            companyId: user.companyId,
            role: user.role,
            space: space,
            token: jwtToken
        })
    } catch(e){
        res.status(400).send({"error": "We can not create user at this time"})
    }
})

router.post('/admin', async(req, res)=>{
    try{
        const result = await User.findByIdAndUpdate(req.body.userId,{
            role: Role.Admin
        },
        {
            new: true
        })
        if(!result){
            return res.status(404).send({'error': 'This user does not exist'})
        }
        res.status(200).send(result)
    } catch(e){
        res.status(400).send(e)
    }
})

//Not Use
router.put('/:id', [
    check('name').isLength({min: 3}),
    check('email').isLength({min: 3})
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const user = await User.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        email: req.body.email
    },
    {
        new: true
    })

    if(!user){
        return res.status(404).send('This user does not exist')
    }
    
    res.status(204).send()
})

//Not use
router.delete('/:id', async(req, res)=>{

    const user = await User.findByIdAndDelete(req.params.id)

    if(!user){
        return res.status(404).send('El user con ese ID no esta, no se puede borrar')
    }

    res.status(200).send('usuario borrado')

})

//Not use
router.delete('/', async(req, res)=> {
    const result = await User.deleteMany({})
    if(!result){
        return res.status(404).send('Problem')
    }
    res.status(200).send(result)
})

//Follow a User
router.post("/follow", auth, async (req, res) => {
    try{
        if (req.user._id !== req.body.userToFollowId) {
            try {
              const userToFollow = await User.findById(req.body.userToFollowId);
              const currentUser = await User.findById(req.user._id);
              if (!userToFollow.followers.includes(req.user._id)) {
                await userToFollow.updateOne({ $push: { followers: req.user._id } });
                await currentUser.updateOne({ $push: { followings: req.body.userToFollowId } });
                res.status(200).send({
                    "status": "success",
                    "data":{
                        "message": "user has been followed"
                    }
                });
              } else {
                res.status(403).send({"error": "you allready follow this user"});
              }
            } catch (err) {
              res.status(500).json(err);
            }
          } else {
            res.status(403).send({"error":"you cant follow yourself"});
          }
    }catch(err){
        res.status(500).json(err);
    }    
  });

  //Unfollow User
  router.post("/unfollow", auth, async (req, res) => {
    try{
        if (req.user._id !== req.body.userToUnFollowId) {
            try {
              const user = await User.findById(req.body.userToUnFollowId);
              const currentUser = await User.findById(req.user._id);
              if (user.followers.includes(req.user._id)) {
                await user.updateOne({ $pull: { followers: req.user._id } });
                await currentUser.updateOne({ $pull: { followings: req.body.userToUnFollowId } });
                res.status(200).send({
                    "status": "success",
                    "data":{
                        "message": "user has been unfollowed"
                    }
                });
              } else {
                res.status(403).send({"error":"you dont follow this user"});
              }
            } catch (err) {
              res.status(500).json(err);
            }
          } else {
            res.status(403).send({"error":"you cant unfollow yourself"});
          }
    }catch(err){
        res.status(500).json(err);
    }
  });

module.exports = router