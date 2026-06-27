import mongoose, { Schema } from 'mongoose'


const CitySchema = new mongoose.Schema({
     CityName:{
        type:"String",
        require:true
     }
})
const StateSchema = new mongoose.Schema({
     StateName:{
        type:"String",
        require:true
     }
})
const CountrySchema = new mongoose.Schema({
     CountryName:{
        type:"String",
        require:true
     }
})

export const cityModel = mongoose.model('city',CitySchema)

export const StateModel = mongoose.model('state',StateSchema)

export const CountryModel = mongoose.model('country',CountrySchema)

