import mongoose from 'mongoose'

const RDVShema = mongoose.Schema({
    fullname: {type: String , required : true},
    email: {type: String , required : true},
    phone: {type: String , required : true},
    date_rdv : {type: String , required : true}
},
{timestamps: true}
)

export default mongoose.model('rendez-vous', RDVShema);