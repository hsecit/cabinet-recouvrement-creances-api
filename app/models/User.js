import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
    fullname: String,
    email: String,
    phone:String,
    password:String
},
{ timestamps: true }
);

export default mongoose.model('users',UserSchema);