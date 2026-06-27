import mongoose from "mongoose";



const bankSchema = new mongoose.Schema({
    bankname:{
        type:String,
        require:true
    },
    ifsccode:{
        type:String,
        require:true,
       
    },
    branchName:{
        type:String,
        require:true
    },
    acccountno:{
        type:String,
        require:true,
            
    },
    passbook_checkImg:{
        type:String,
        require:true
    }
})


const bankModel = mongoose.model('bankdetail',bankSchema)



export default bankModel;