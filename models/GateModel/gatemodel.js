import mongoose from "mongoose";


const GateSchema = new mongoose.Schema({
      gateName: {
        type: String,
        required: true
    },
     gateCode: {
        type: String,
        unique: true
    },
    location: String,

    isActive: {
        type: Boolean,
        default: true
    }
},{timestamps : true})


const GateModel = mongoose.model('gate',GateSchema)

export default GateModel;