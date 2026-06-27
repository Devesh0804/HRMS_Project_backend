import express from "express";
import roleModel from "../../models/RoleModel/RoleModel.js";
import mongoose from "mongoose";

const router = express.Router();


/**
 *  save-> savedata
 *  update->updatedata
 *  show->search
 *    ->searchById/{id}
 *    ->SearchBy/{columnname}/{columnvalue}/{sortorder}
 *  deleteById
 */

router.post('/savedata', async (req, res) => {
   try {
     const { roleName, createdBy, updatedBy } = req.body
    await roleModel.create({
        roleName : roleName,
        createdBy : createdBy,
        updatedBy : updatedBy
    })
    res.status(200).json({message : "data saved successfully"});
   } catch (error) {
       res.status(500).json({error : error.message});
   }
})


//searchById
router.get('/search/:id',async(req,res)=>{
     console.log(req.params.id);
     let id = new mongoose.Types.ObjectId(req.params.id);
     console.log(id);
     
     let role = await roleModel.findById({_id : id});
     res.send(role); 
})


//Search
router.get('/search',async(req,res)=>{
    let key  = req.query.value;
      
    if(!key){
        res.send('please pass the search parameter');
    }
    else{
     
      let searchCondition = [
        {roleName : {$regex : key, $options: 'i'}}
      ]
      

      let role  = await roleModel.findOne({$or : searchCondition})
      res.send(role);
    }
})





export default router;