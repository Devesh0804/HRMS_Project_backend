import mongoose, { Schema } from 'mongoose'


const userSchema = new mongoose.Schema({
    FullName : {
        firstName : {
            type : String,
            require : true,

        },
        lastName : {
            type : String,
            
        }
    },
    useremail : {
      type : String,
      require : true,
    },
    username : {
        type :String,
        require : true,
    },
    password : {
    type : String,
    require :true
    },
    mobile : {
        type : String ,
        require : true,
    },
     AlternateMobile : {
        type : String ,
        require : true,
    },
    gender:{
        type :String,
        enum : ['Male','Female','Others']
    },
    DOB:{
        type:String,
        require:true
    },
    address:{
        city:{
            type: Schema.Types.ObjectId,
            ref:'city'
        },
        state:{ 
            type: Schema.Types.ObjectId,
            ref:'state'
        },
        country:{
            type: Schema.Types.ObjectId,
            ref:'country'

        }
    },
    Documents :{
        type : Schema.Types.ObjectId,
        ref:'document'
    },
    BankDetails:{
        type:Schema.Types.ObjectId,
        ref:'bankdetail'
    },
    status:{
        type:String
    },
    AccountStatus:{
         type:String
    },
    startsession:{
       type:String
    },
    endsession:{
     type:String
    },
    department : {
        type : Schema.Types.ObjectId,
        ref : 'department'
    },
    role : {
        type : Schema.Types.ObjectId,
        ref : 'role'
    },
    roleName : {
        type : String,
        enum : ['Superadmin','Admin','User'],
        default : 'User'
    },
    AttendenceStatus:[{
        type : Schema.Types.ObjectId,
        ref:'attendence'
    }]


},{timestamps : true})




const userModel = mongoose.model('users',userSchema)


export default userModel
