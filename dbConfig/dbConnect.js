import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config();



const connectDB = ()=>{
      mongoose.connect(process.env.DB_URL).then(()=>{
         console.log('database connected successfully')
      }).catch((err)=>{
        console.log(err)
      })
}


export default connectDB;