import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    Marks_10th:{
       type:String,
       require:true
    },
     Marks_12th:{
       type:String,
       require:true
    },
    UG_qualifications:{
        type:String,
        
    },
    PG_qualifications:{
        type:String
    }


})


const documentModel = mongoose.model('document',documentSchema)

export default documentModel;