const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const office = require('./routes/office')
const floor = require('./routes/floor')
const user = require('./routes/user')
const company = require('./routes/company')
const booking = require('./routes/booking')
const auth = require('./routes/auth')
app.use('/api/office/', office)
app.use('/api/floor/', floor)
app.use('/api/user/', user)
app.use('/api/company/', company)
app.use('/api/booking/', booking)
app.use('/api/auth/', auth)
app.use('/public', express.static('public'))


const port = process.env.PORT || 3005
app.listen(port, ()=> console.log("Listening Port: " + port))

/*
mongoose.connect('mongodb://localhost:27017/gdeskdb', {useNewUrlParser: true})
    .then(()=> console.log('Conectado correctamente a MongoDB'))
    .catch(()=> console.log('Error al conectarse a MongoDB'))
*/

mongoose.connect('mongodb+srv://gdesk:gidplus23-FF@cluster0.kd7z35t.mongodb.net/?retryWrites=true&w=majority')
    .then(()=> console.log('Conectado correctamente a MongoDB'))
    .catch(()=> console.log('Error al conectarse a MongoDB'))