import mongoose, { Schema } from "mongoose";


const RoleSchema = new mongoose.Schema({
      roleName : {
        type : String,
        enum : ['Superadmin','Admin','User'],
        require : true
      },
      createdBy : {
         Name : {
            type : String,
            require : true
         }
      },
        updatedBy : {
         Name : {
            type : String,
            require : true
         }
      }
      
},{timestamps:true})


const roleModel = mongoose.model('role',RoleSchema)


export default roleModel;