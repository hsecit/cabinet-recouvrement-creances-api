import mongoose from 'mongoose'

const ContactShema = mongoose.Schema({
    fullname: {type: String , required : true},
    email: {type: String , required : true},
    phone: {type: String , required : true},
    demand: {type: String , required : true}

},{
    timestamps:true
})

export default mongoose.model('contact',ContactShema)