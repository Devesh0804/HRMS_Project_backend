import mongoose, { mongo, Schema } from "mongoose";


const attendenceSchema = new mongoose.Schema({
    AttendedAt: {
      type: Date  
   },
    AttendenceStatus:{
        type:String,    
        enum :["A","P","HD","Half Day"],
        require:true
    },
    userId:{
        type : Schema.Types.ObjectId,
        ref:'users'
    }

});

const LeaveSchema = new mongoose.Schema({
    UserInfo :{
        type : Schema.Types.ObjectId,
        ref:"users",
        require:true
    },
    startDate:{
        type:Date,
        require : true
    },
    endDate:{
        type :Date,
        require :true
    },
    LeaveType:{
        type:String,
        rquire:true
    },
    LeaveDiscription:{
        type:String,
        require :true
    },
    leaveStatus:{   /* LeaveStatus-> approved / rejected  */
        type :String
    }
})




export const AttendenceModel = mongoose.model('attendence',attendenceSchema);
export const LeaveModel = mongoose.model('leaveInfo',LeaveSchema);

