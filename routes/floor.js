const auth = require('../middleware/auth')
const autorize = require('../middleware/role')
const Role = require('../helpers/role')
const mongoose = require('mongoose')
const express = require('express')
const Office = require('../models/office')
const Floor = require('../models/floor')
const Desk = require('../models/desk')
const {Company} = require('../models/company')
const upload = require('../middleware/file')

const router = express.Router()
const { body, validationResult, check } = require('express-validator')

const date = require('../date')
var morgan = require('morgan')


router.use(date)
router.use(morgan('tiny'))

router.get('/office/:id', async(req, res)=> {
    try{
        const floors = await Floor
        .find({officeId: req.params.id})
        .populate('officeId', 'name')
        .populate({
            path: 'desks'
        })
    res.send(floors)
    }catch(e){
        return res.status(400).send(["error", "We can not show the floors for this office"])
    }
})

router.get('/:id', async(req, res)=> {
    try{
        const floors = await Floor
        .findById(req.params.id)
        .populate('officeId', 'name')
        .populate({
            path: 'desks'
        })
    res.send(floors)
    }catch(e){
        return res.status(400).send(["error", "We can not show the floors for this office"])
    }
})


router.post('/', async(req, res)=> {  
    try{
        let office = await Office.findById(req.body.officeId)
        if(!office) return res.status(400).send({'error': 'This Office ID does not exit'})  
        var floor = new Floor({
            officeId: req.body.officeId,
            name: req.body.name,
        })
        result = await floor.save()

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
                    floorId: result._id,
                    officeId: result.officeId
                })
                deskToSave.save()
                totalDesks.push(deskToSave._id)   
            });
        }

        floor = await Floor.findById(result._id)
        if(!floor) return res.status(400).send({'error': 'This Office ID does not exit'})  
        floor.desks = totalDesks
        var updateFloors = office.floors
        console.log(updateFloors)
        updateFloors.push(floor._id) 
        console.log(updateFloors)
        const resultFloors = await Office.findByIdAndUpdate(req.body.officeId,{
            floors: updateFloors
        },
        {
            new: true
        })
        result = await floor.save()
        res.status(201).send(result)

    }catch(e){
        return res.status(400).send({"error": "We can not create this floor"})
    }
})

router.post('/update/:id', async(req, res)=> {
    try{
        const floor = await Floor.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
        },
        {
            new: true
        })
        if(!floor){
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
                            floorId: req.params.id
                        },
                        {
                            new: true
                        })
                        if(!deskToSave){
                            return res.status(404).send({'error':'This desk ID does not exist'})
                        }
                        totalDesks.push(deskToSave._id) 
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
                            floorId: req.params.id
                        })
                        await deskToSave.save()
                        totalDesks.push(deskToSave._id)   
                    }
                }
            }
        floor.desks = totalDesks
        result = await floor.save()
        res.status(200).send(floor)
    }catch(e){
        return res.status(400).send({"error": "We can not update this floor"})
    }  
})

router.post('/upload/:id', upload.single('image'), async(req, res)=> {   
    try{
        let floor = await Floor.findById(req.params.id)
        if(!floor) return res.status(404).send('This Floor ID does not exist')
        const url = req.protocol + '://' + req.get('host')
        let imageUrl = null
        try{
            if(req.file.filename){
                imageUrl = url + '/public/' + req.file.filename
            } else {
                imageUrl = null
            }

            const result = await Floor.findByIdAndUpdate(req.params.id,{
                imageUrl: imageUrl
            },
            {
                new: true
            })

            res.status(200).send(result)
        }catch(error) {
            console.log(error)
            return res.status(400).send(["error", "We can not update this floor for you"])
        }
    }catch(e){
        return res.status(400).send(["error", "We can not update floor"])
    }
})


module.exports = router