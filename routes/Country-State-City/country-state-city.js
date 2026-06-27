import express from 'express'
import country_city_state_Model from '../../models/Country-City-StateModel.js';
const router = express.Router();

router.get('/getData',async(req,res)=>{
    const data = await country_city_state_Model.find();
//  console.log(data[0].name)
//     console.log(data[0].states[0].name)
//     console.log(data[0].states[0].cities[0].name)   
    
    res.send(data);

})


export default router