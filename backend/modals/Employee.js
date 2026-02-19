const mongoose=require('mongoose');
const User=require('./User')

const employeeSchema=new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique:true
    },
    image:{
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    mobile: {
        type: Number,
        unique: true
    },
    designation: {
        type: String,
    },
    gender: {
        type: String,
    },
    course: {
        type: String,
        enum: ['MCA','BCA','BSC'],
        default: "MCA",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    }

},{timestamps:true});

module.exports= mongoose.model("Employee", employeeSchema);