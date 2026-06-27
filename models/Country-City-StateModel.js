import mongoose from "mongoose";

const country_city_state_Schema = new mongoose.Schema({},{strict:false})


const country_city_state_Model = mongoose.model('countries-city-states',country_city_state_Schema,'countries-city-states')




export default country_city_state_Model;


