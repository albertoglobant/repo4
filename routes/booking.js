const auth = require('../middleware/auth')
const express = require('express')
const Booking = require('../models/booking')
const Desk = require('../models/desk')
const User = require('../models/user')
const Office = require('../models/office')
const Floor = require('../models/floor')

const router = express.Router()

function checkDate(bookingDate){
    if(!bookingDate){
        return 'Invalid Date'
    }
    var date = new Date(bookingDate)
    if(date == "Invalid Date"){
        return 'Invalid Date'
    }
    return date
}

//Get All the Booking for one user
router.post('/next-booking', async(req, res)=>{
    try{
        const user = await User.findById(req.body.userId)
        if(!user) return res.status(400).send('This User ID does not exist')
        currentDay = new Date().setHours(0,0,0,0)
        const booking = await Booking
            .find()
            .and([{userId: user}, {bookingDate: {$gte: currentDay}}])
            .populate({
                path: 'userId',
                select: 'name email'
            })
            .populate({
                path: 'deskId',
                select: ['name', 'type']
            })
            .populate({
                path: 'officeId',
                    select: ['name', 'address', 'floor', 'country']
            })
            .populate({
                path: 'floorId',
                    select: ['name']
            })
        res.send(booking)
    }catch(e){
        return res.status(400).send(["error", "We can not get your booking at this time"])
    }
})

//Get All the Booking for one office one day
router.post('/day-and-office', async(req, res)=>{
    try{
        const bookingDate = new Date(req.body.date)
        const date = checkDate(bookingDate)
        if(date == 'Invalid Date'){
            return res.status(400).send("Invalid date")
        }
        const office = await Office.findById(req.body.officeId)
        if(!office) return res.status(400).send('This Office ID does not exist')
        const booking = await Booking
            .find()
            .and([{officeId: office._id},{bookingDate: date}])
            .populate({
                path: 'userId',
                select: ['name', 'email']
            })
            .populate({
                path: 'deskId',
                select: ['name', 'type']
            })
            .populate({
                path: 'officeId',
                select: ['name', 'address', 'floor', 'country']
            })
        res.send(booking)
    }catch(e){
        return res.status(400).send(["error", "We can not get your booking"])
    }
})

//Get All the Booking for one office one day
router.post('/day-and-floor', async(req, res)=>{
    try{
        const bookingDate = new Date(req.body.date)
        const date = checkDate(bookingDate)
        if(date == 'Invalid Date'){
            return res.status(400).send("Invalid date")
        }
        const floor = await Floor.findById(req.body.floorId)
        if(!floor) return res.status(400).send('This Floor ID does not exist')
        const booking = await Booking
            .find()
            .and([{floorId: floor._id},{bookingDate: date}])
            .populate({
                path: 'userId',
                select: ['name', 'email']
            })
            .populate({
                path: 'deskId',
                select: ['name', 'type']
            })
        res.send(booking)
    }catch(e){
        return res.status(400).send(["error", "We can not get your booking"])
    }
})

router.post('/', auth, async(req, res)=>{
    try{
        const user = await User.findById(req.user._id)
        if(!user) return res.status(400).send('This User ID does not exist')

        const desk = await Desk.findById(req.body.deskId)
        if(!desk) return res.status(400).send('This desk ID does not exist')

        const bookingDate = req.body.bookingDate
        if(!bookingDate){
            return res.status(400).send('Date is incorrect')
        }
        var date = new Date(bookingDate)
        if(date == "Invalid Date"){
            return res.status(400).send('Invalid Date Format the correct format is 2040-10-28T00:00:00Z')
        }    
        const thisDeskIsBookedThisDate = await Booking
            .find()
            .and([{deskId: desk._id},{bookingDate: date}])
        console.log(thisDeskIsBookedThisDate)
        if(thisDeskIsBookedThisDate.length != 0){
            return res.status(400).send({"error":'This desk is alredy booked this day, please selet another one.'})
        }   

        const booking = new Booking({
            userId: user._id,
            deskId: desk._id,
            officeId: desk.officeId,
            floorId: desk.floorId,
            bookingDate : date
        })

        const result = await booking.save()
        res.status(200).send(result)
    }catch(e){
        return res.status(400).send(["error", "We can not create your booking"])
    }
})

router.post('/release', async(req, res)=>{
    try{
        const booking = await Booking.findById(req.body.bookingId)
        if(!booking) return res.status(400).send('This Booking ID does not exist')
        const result = await Booking.deleteOne({_id : req.body.bookingId})

    /*
    const user = await User.findById(req.body.userId)
    if(!user) return res.status(400).send('This User ID does not exist')

    const desk = await Desk.findById(req.body.deskId)
    if(!desk) return res.status(400).send('This desk ID does not exist')

    const bookingDate = req.body.bookingDate
    if(!bookingDate){
        return res.status(400).send('Date is incorrect')
    }
    var date = new Date(bookingDate)
    if(date == "Invalid Date"){
        return res.status(400).send('Invalid Date Format the correct format is 2040-10-28T00:00:00Z')
    } 
    
    const thisDeskIsBookedThisDateByThisUser = await Booking
        .find()
        .and([{deskId: desk._id},{bookingDate: date}, {userId: user._id}])
    console.log(thisDeskIsBookedThisDateByThisUser[0]._id)
    if(thisDeskIsBookedThisDateByThisUser.length == 0){
        return res.status(400).send({"error":'This desk is not your, you can not release.'})
    }   

    const result = await Booking.deleteOne({_id : thisDeskIsBookedThisDateByThisUser[0]._id})
    */
        res.status(200).send(result)
    }catch(e){
        return res.status(400).send(["error", "We can not release your booking"])
    }
})

router.delete('/', async(req, res)=> {
    const result = await Booking.deleteMany({})
    if(!result){
        return res.status(404).send('Problem')
    }
    res.status(200).send(result)
})


module.exports = router