import mongoose from "mongoose";


const clientSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    clientCode: {
        type: String,
        required: true,
        unique: true
    },
    industry: {
        type: String
    },
    contactPerson: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    gstNumber: {
        type: String
    },
    companySize: {
        type: String
    },
    website: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    postalCode: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
},{timestamps : true})



const ClientModel = mongoose.model('client',clientSchema);

export default ClientModel;
