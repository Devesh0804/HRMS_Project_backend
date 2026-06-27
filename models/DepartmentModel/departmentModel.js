import mongoose, { Schema } from "mongoose";
import dotenv from 'dotenv'

dotenv.config();


const departmentSchema = new mongoose.Schema({
    deptName : {
        type : String,
        uinque : true,
        require : true
    },
    deptCode : {
        type : String,
        uinque : true,
        require : true
    },
    subDep : {
        type : String,
        require : true
    },
    salary : {
        minSalary : {
            type:Number
        },
        maxSalary : {
            type:Number
        }
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
      },
      users : [{
        type:Schema.Types.ObjectId,
        ref : 'users'
      }]
})


const departMentModel = mongoose.model('department',departmentSchema);

export default departMentModel;