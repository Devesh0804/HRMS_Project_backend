import express from 'express';
import { AttendenceModel, LeaveModel } from '../../models/AttendenceModel/attendenceModel.js';
import userModel from '../../models/UserModel/userModel.js';
import { officeConfig } from '../../Config/Officeconfig.js';


const router = express.Router();








router.post('/savedata', async (req, res) => {
    try {
        
    console.log(req.user)
       async function verifyLocation(latitude,longitude,date,id){
            const latDiff = Math.abs(latitude - officeConfig.officeLatitude)
            const longDiff = Math.abs(longitude - officeConfig.officeLongitude)
             const currentTime = date.toLocaleTimeString("en-IN")
             const HalfDayCheck = new Date()
             HalfDayCheck.setHours(14,10,0,0)
             const FullDayCheck = new Date()
             FullDayCheck.setHours(18,0,0,0)
            
             
             
            
              

            
            const allowedRange = 0.005;
            if(latDiff <= allowedRange && longDiff <= allowedRange){
              let status;
              if(currentTime >= HalfDayCheck && currentTime < FullDayCheck){
                status = "Half Day"
              }else if(currentTime >= FullDayCheck){
                status = "A"
              }else{
                status = "P"
              }
              // console.log(status);
              
                
              const attendence =  await AttendenceModel.create({
                  AttendedAt : date,
                  AttendenceStatus : status
                })
                // console.log(attendence);
             const user =  await userModel.findByIdAndUpdate(id,
              {
                $push:
                {
                  AttendenceStatus : attendence._id
                }
              },{new : true})
              // console.log(user);
              
                  res.status(200).json({message : "location verified"})
            }else{
                res.status(400).json({message : "invalid location"})
            }

        }
        
        
        const { location, formatted , _id } = req.body
        
        
       const date = new Date(formatted)
      //  console.log('date from frontend',date);
       
     
       
         
        verifyLocation(location.latitude,location.longitude,date,_id);
          
    } catch (error) {
       console.log(error);
       res.status(500).json({message : error.message})
       
    }


})

router.get('/check-attendence',async(req,res)=>{
 try {
  //  console.log('route hit');
  
  const employeeId = req.user._id
// console.log(employeeId);

  
  const todayDate = new Date().toISOString().split("T")[0]
  // console.log(todayDate);
  
 
  
  const attendence = await AttendenceModel.find()
  let dbDate
  const alreadyMarked = attendence.find((item)=>{
    dbDate = new Date(item.AttendedAt).toISOString().split("T")[0]
  })
  
  if(dbDate){
    return res.json({marked : true})
  }

else{
  res.json({marked : false})
}
 } catch (error) {
   res.json({error: error})
  
 }
  
})

router.get('/getData',async(req,res)=>{
   
  const _id = req.user._id;
  // console.log(_id);
  
  
 const user = await userModel.findById(_id).populate({
  path : 'AttendenceStatus',
  select : 'AttendedAt AttendenceStatus'
 })
console.log(user);

if(!user){
  res.status(401).json({message : 'no user available'})
}
//  console.log(user.AttendenceStatus);
 res.status(200).json({attendence : user.AttendenceStatus})
 
})




router.post('/gate-savedata', async (req, res) => {
    // try {
        
    console.log(req.user)
    res.send("data posted")
    //    async function verifyLocation(latitude,longitude,date,id){
    //         const latDiff = Math.abs(latitude - officeConfig.officeLatitude)
    //         const longDiff = Math.abs(longitude - officeConfig.officeLongitude)
    //          const currentTime = date.toLocaleTimeString("en-IN")
    //          const HalfDayCheck = new Date()
    //          HalfDayCheck.setHours(14,10,0,0)
    //          const FullDayCheck = new Date()
    //          FullDayCheck.setHours(18,0,0,0)
            
             
             
            
              

            
    //         const allowedRange = 0.005;
    //         if(latDiff <= allowedRange && longDiff <= allowedRange){
    //           let status;
    //           if(currentTime >= HalfDayCheck && currentTime < FullDayCheck){
    //             status = "Half Day"
    //           }else if(currentTime >= FullDayCheck){
    //             status = "A"
    //           }else{
    //             status = "P"
    //           }
    //           console.log(status);
              
                
    //           const attendence =  await AttendenceModel.create({
    //               AttendedAt : date,
    //               AttendenceStatus : status
    //             })
    //             // console.log(attendence);
    //          const user =  await userModel.findByIdAndUpdate(id,
    //           {
    //             $push:
    //             {
    //               AttendenceStatus : attendence._id
    //             }
    //           },{new : true})
    //           console.log(user);
              
    //               res.status(200).json({message : "location verified"})
    //         }else{
    //             res.status(400).json({message : "invalid location"})
    //         }

    //     }
        
        
    //     const { location, formatted , _id } = req.body
        
        
    //    const date = new Date(formatted)
    //    console.log('date from frontend',date);
       
     
       
         
    //     verifyLocation(location.latitude,location.longitude,date,_id);
          
    // } catch (error) {
    //    console.log(error);
    //    res.status(500).json({message : error.message})
       
    // }


})


// router.post('/', async (req, res) => {
//     try {
//         const { username } = req.body;

//         const user = await userModel.findOne({ username: username });
//         let attendenceStatus;
//         if (user.startsession && user.endsession) {
//             attendenceStatus = "P"
//         } else {
//             attendenceStatus = "A"
//         }

//         const attendence = await AttendenceModel.create({
//             UserInfo: user._id,
//             AttendenceStatus: attendenceStatus
//         })
//         const result = await attendence.populate('UserInfo')
//         res.status(200).json({ message: "attendencd updated succesfully : ", result });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }


// })


// //Leave Route
// router.post('/leave', async (req, res) => {
//     try {
//         const { username, startDate, endDate, LeaveType, LeaveDiscription } = req.body;
//         console.log(username);

//         const user = await userModel.findOne({ username: username });




//         const leave = await LeaveModel.create({
//             UserInfo: user._id,
//             startDate :startDate,
//             endDate :endDate,
//             LeaveType :LeaveType,
//             LeaveDiscription : LeaveDiscription

//         })
//         const result = await leave.populate('UserInfo')
//         res.status(200).json({ message: "attendencd updated succesfully : ", result });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }


// })


export default router