const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/carsdb', {useNewUrlParser: true})
    .then(()=> console.log('Conectado correctamente a MongoDB'))
    .catch(()=> console.log('Error al conectarse a MongoDB'))


const officeSchema = new mongoose.Schema({
    company: String,
    name: String,
    address: String,
    date: {type: Date, default: Date.now}
}) 

const Office = mongoose.model('office', officeSchema)

//deleteOffice('5d65517567d6f6d093db5921')
async function deleteOffice(id){
    const result = await Office.deleteOne({_id: id})
    console.log(result)
}

//updateOffice('62fd32f8d4b98e49703d6d9a')
async function updateOffice(id){
    const office = await Office.findById(id)
    if(!office) return

    office.company = 'Gid+'
    office.name = 'Avila'

    const result = await office.save()
    console.log(result)
}

//getOffices()
async function getOffices(){
    const offices = await Office.find()
    console.log(offices)
}

//createOffice()
async function createOffice(){
    const office = new Office({
        company: "Globant",
        name: "Madrid",
        address: "Aldecoa n44",
    })

    const result = await office.save()
    console.log(result)
}

