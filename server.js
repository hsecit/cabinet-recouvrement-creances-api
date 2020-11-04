// import module
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// import routes
import TestimonialRoute from './app/routes/rTestimonial.js'
import RendezVousRoute from './app/routes/rRendezVous.js'
import ContactRoute from './app/routes/rContact.js'
import UserRoute from './app/routes/rUser.js'
// app conf
const app = express()
dotenv.config()
const port = process.env.PORT || 3000


// db config
const url_connection = 'mongodb+srv://hamza_root:hamza_root@cluster0.tfhvf.mongodb.net/crc_db?retryWrites=true&w=majority';
mongoose.connect(url_connection ,{
    useNewUrlParser: true ,
    useCreateIndex : true,
    useUnifiedTopology: true
})

// middleware 
app.use(express.json())
app.use('/testimentals',TestimonialRoute);
app.use('/rdvs',RendezVousRoute);
app.use('/contacts',ContactRoute)
app.use('/users',UserRoute)
// api routes
app.get('/', (req,res) => {
    res.status(200).send("helloo from the server")
})

// launch the server to listen
app.listen(port , ()=> console.log(`starting server on ${port}`) )