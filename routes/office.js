const auth = require('../middleware/auth')
const autorize = require('../middleware/role')
const Role = require('../helpers/role')
const mongoose = require('mongoose')
const express = require('express')
const Office = require('../models/office')
const Desk = require('../models/desk')
const {Company} = require('../models/company')
const upload = require('../middleware/file')

const router = express.Router()
const { body, validationResult, check } = require('express-validator')

const date = require('../date')
var morgan = require('morgan')


router.use(date)
router.use(morgan('tiny'))

router.get('/', async(req, res)=> {
    try{
        const offices = await Office
        .find()
        .populate('companyId', 'name')
        .populate({
            path: 'desks',
            populate: {path: 'desk'}
        })
        .populate({
            path: 'floors',
            populate: {path: 'desks'}
        })
    res.send(offices)
    }catch(e){
        return res.status(400).send({"error":"We can not show the offices for this user"})
    }
})

router.get('/:id', async(req, res)=> {
    try{
        const office = await Office.findById(req.params.id)
        .populate({
            path: 'desks',
            populate: {path: 'desk'}
        })
        if(!office) return res.status(404).send('This office ID does not exist')
        res.send(office)
    }catch(e){
        return res.status(400).send(["error", "We can not find this office"])
    }
})

router.post('/', async(req, res)=> {  
    try{
        let company = await Company.findById(req.body.companyId)
        if(!company) return res.status(400).send({'error': 'This Company does not exit'})  
        console.log(company)
        var office = new Office({
            companyId: req.body.companyId,
            name: req.body.name,
            country: req.body.country,
            address: req.body.address,
            floor: req.body.floor,
            //desks: totalDesks
            // desk: desk1._id,
            // desks: [
            //     {desk: desk1._id},
            //     {desk: desk13._id},
            // ]
        })
        result = await office.save()

        const deskFromRequest = req.body.desks
        var totalDesks = []
        if(deskFromRequest){
            await deskFromRequest.forEach(element => {
                const deskToSave = new Desk({
                    name: element.name,
                    type: element.type,
                    coords: {
                        angle: element.coords.angle,
                        x: element.coords.x,
                        y: element.coords.y,
                    },
                    officeId: result._id
                })
                deskToSave.save()
                var desk = {'desk': deskToSave._id}
                totalDesks.push(desk)   
            });
        }

        office = await Office.findById(result._id)
        if(!office) return
        office.desks = totalDesks
        result = await office.save()

        res.status(201).send(result)

    }catch(e){
        return res.status(400).send(["error", "We can not create this office"])
    }

})

router.post('/update/:id', async(req, res)=> {
    try{
        const office = await Office.findByIdAndUpdate(req.params.id, {
            companyId: req.body.companyId,
            name: req.body.name,
            country: req.body.country,
            address: req.body.address,
            floor: req.body.floor
        },
        {
            new: true
        })
        if(!office){
            return res.status(404).send('This office ID does not exist')
        }
        const deskFromRequest = req.body.desks
            var totalDesks = []
            if(deskFromRequest){
                for (const element of deskFromRequest){
                    if(element._id){
                        console.log("Old Desk to Update")
                        console.log(element._id)
                        const deskToSave = await Desk.findByIdAndUpdate(element._id, {
                            name: element.name,
                            type: element.type,
                            coords: {
                                angle: element.coords.angle,
                                x: element.coords.x,
                                y: element.coords.y,
                            },
                            officeId: req.params.id
                        },
                        {
                            new: true
                        })
                        if(!deskToSave){
                            return res.status(404).send({'error':'This desk ID does not exist'})
                        }
                        var desk = {'desk': deskToSave._id}
                        console.log(desk)
                        totalDesks.push(desk) 
                    } else {
                        console.log("New Desk")
                        const deskToSave = new Desk({
                            name: element.name,
                            type: element.type,
                            coords: {
                                angle: element.coords.angle,
                                x: element.coords.x,
                                y: element.coords.y,
                            },
                            officeId: req.params.id
                        })
                        deskToSave.save()
                        var desk = {'desk': deskToSave._id}
                        totalDesks.push(desk)   
                    }
                }
            }
        office.desks = totalDesks
        result = await office.save()
        res.status(200).send(office)
    }catch(e){
        return res.status(400).send(["error", "We can not update this office"])
    }  
})

router.put('/:id', async(req, res)=> {
    
    const office = await Office.findByIdAndUpdate(req.params.id, {
        companyId: req.body.companyId,
        name: req.body.name,
        country: req.body.country,
        address: req.body.address,
        floor: req.body.floor
    },
    {
        new: true
    })
    if(!office){
        return res.status(404).send('This office ID does not exist')
    }
    res.status(200).send(office)
})

router.delete('/:id', async(req, res)=>{
    const office = await Office.findByIdAndDelete(req.params.id)
    if(!office){
        return res.status(404).send('This office ID does not exist')
    }
    res.status(200).send('Deleted Office')
})


router.post('/upload/:id', upload.single('image'), async(req, res)=> {   
    try{
        let office = await Office.findById(req.params.id)
        if(!office) return res.status(404).send('This office ID does not exist')
        const url = req.protocol + '://' + req.get('host')
        let imageUrl = null
        try{
            if(req.file.filename){
                imageUrl = url + '/public/' + req.file.filename
            } else {
                imageUrl = null
            }

            const result = await Office.findByIdAndUpdate(req.params.id,{
                imageUrl: imageUrl
            },
            {
                new: true
            })

            res.status(200).send(result)
        }catch(error) {
            console.log(error)
            return res.status(400).send(["error", "We can not create this office"])
        }
    }catch(e){
        return res.status(400).send(["error", "We can not create this office"])
    }
})

router.delete('/', async(req, res)=> {
    const result = await Office.deleteMany({})
    if(!result){
        return res.status(404).send('Problem')
    }
    res.status(200).send(result)
})

module.exports = router