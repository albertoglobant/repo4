const express = require('express')
const {Company} = require('../models/company')
const router = express.Router()

//Not Use
router.get('/', async(req, res)=> {
    const companies = await Company.find()
    res.send(companies)
})

router.get('/:id', async(req, res)=>{
    try{
        const company = await Company.findById(req.params.id)
        if(!company) return res.status(404).send('This company does not exist')
        res.send(company)
    }catch(error){
        res.status(400).send(error)
    }
})

router.post('/',async(req, res)=>{
    try{
        let user = await Company.findOne({space: req.body.space})
        if(user) return res.status(400).send({'error': 'This Company does already exist'})
        const company = new Company({
            name: req.body.name,
            country: req.body.country,
            space: req.body.space
        })
        const result = await company.save()
        res.status(200).send(result)
    }catch(error){
        res.status(400).send(error)
    }
})

//Not Use
router.put('/:id', async (req, res)=>{

    const company = await Company.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        country: req.body.country
    },
    {
        new: true
    })

    if(!company){
        return res.status(404).send('This company does not exist')
    }
    
    res.status(204).send()
})

//Not Use
router.delete('/:id', async(req, res)=>{
    

    const company = await Company.findByIdAndDelete(req.params.id)

    if(!company){
        return res.status(404).send('This company does not exist')
    }

    res.status(200).send('company deleted')


})

module.exports = router