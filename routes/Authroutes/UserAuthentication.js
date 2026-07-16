import express, { json } from 'express'
import userModel from '../../models/UserModel/userModel.js'
import roleModel from '../../models/RoleModel/RoleModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import dns from 'node:dns'
import { log } from 'node:console'

dotenv.config()
const router = express.Router();




//SuperAdmin-Login
router.post('/login', async (req, res) => {
   try {

       console.log('route hit');
      const { useremail, username, password } = req.body;

      let user = await userModel.findOne({$or:[{ username : username } ,{ useremail : useremail}] })
     
      
      if(!user){
         return res.status(404).json({message:"user not found  "})
      }
      
       const isHashed =
            user.password.startsWith('$2a$') ||
            user.password.startsWith('$2b$') ||
            user.password.startsWith('$2y$');
    
      
       let isPassword =false
       if(isHashed){
        isPassword = await bcrypt.compare(password,user.password)
       }else{
         isPassword = password === user.password
       
         
       }
   
   
   
       
       if(!isPassword){
         return res.status(400).json({message:"incorrect password"})
       }
        
        const length = await userModel.countDocuments()
        let condition;
        if(user.roleName == "Superadmin" && length == 1){
          condition = true
        }
        

        if(user.roleName == "User" && user.AccountStatus == "Locked"){
             await user.updateOne({AccountStatus : "Unlocked"})
        }

        

       if((username || useremail) && password){

        


           const token = jwt.sign({_id:user._id,name:user.username, role : user.roleName ,condition},process.env.JWT_SECRET,{expiresIn:'10h'}) 
           res.json({token});
       }else{
        res.status(401).json({message : "user not verified"})
       }
    } catch (error) {
        res.status(500).json({ message: error.message, error: error.message })
    } 
})

router.post('/logout', async (req, res) => {
   try {
      res.clearCookie('token');
      if (req.session) {
         req.session.destroy((err) => {
            if (err) {
               console.error('Session destroy error:', err);
            }
         });
      }
      return res.status(200).json({ message: 'Logout successful' });
   } catch (error) {
      return res.status(500).json({ message: 'Logout failed', error: error.message });
   }
});

router.post('/register',async(req,res)=>{
   try {
         const { FullName, useremail, username, password, mobile, roleName } = req.body;
      
           console.log( FullName, useremail, username, password, mobile, roleName );
           
           
         const existData = await userModel.findOne({ username: username })
         if (existData) {
            return res.status(400).json({ message: "user already exist" });
         }
   
         // const departmentData = await departMentModel.findOne({ deptCode: department });
   
         const Name = FullName.firstName + " " + FullName.lastName   
   
         // let EmpRole = new roleModel({ roleName: role, createdBy: { Name: Name }, updatedBy: { Name: Name } })
         // await EmpRole.save();
         // console.log(EmpRole);
   
      
   
         const hashpassword = await bcrypt.hash(password,10);
       
         
   
         let user = await userModel.create({FullName, useremail, password: hashpassword, username, mobile, roleName: roleName });
         console.log(user);
         
   
   
   
        let result = await user.populate('role')
        console.log(result);
        
   
         // let result = await (await user.populate('department')).populate('role')
         // console.log(result);
   
   
         res.status(200).json({ message: "data saved successfully", result })
   
   
      } catch (error) {
         res.status(500).json(error.message)
      }
})



dns.setDefaultResultOrder("ipv4first")


const transportter = nodemailer.createTransport({
   service:"gmail",
   auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS
   },
   family: 4
});


router.post('/forgot_pass',async(req,res)=>{
   try {
      const {useremail} = req.body;
      const user = await userModel.findOne({useremail:useremail})
      if(!user){
         return res.status(404).json({message:`${useremail} is not exist`})
      }


      
      const token = jwt.sign({
         id:user._id
      },process.env.JWT_SECRET,
      {expiresIn:"5m"})

      const resetUrl = `https://hrms-project-frontend-beta.vercel.app/reset-pass/${token}`
      
      //   http://localhost:5173/reset-pass/${token}


      console.log("EMAIL_USER:", process.env.EMAIL_USER);
      console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Present" : "Missing");




      try {
    await transportter.verify();
    console.log("SMTP connection successful");
} catch (err) {
    console.error("SMTP Verify Error:", err);
}
      
      await transportter.sendMail({
         from:process.env.EMAIL_USER,
         to:useremail,
         subject:"Reset your pass",
         html: ` <h2>Password Reset</h2>

        <p>Click the button below.</p>

        <a href="${resetUrl}">
            Reset Password
        </a>

        <p>Link expires in 5 minutes.</p>
        `
      })
      
      res.status(200).json({message:`reset password mail sends successfully on ${useremail} `})

   } catch (error) {
   console.error("Forgot Password Error:", error);

   res.status(500).json({
      message: error.message,
      stack: error.stack
   });
}
   
})



router.post('/reset-password/:token',async(req,res)=>{
     try {
         
      const {password} = req.body;


         let {token} = req.params;
         if(!token){
            return res.status(401).json({ message: 'Unauthorized: token missing' });
         }
         token = token.trim();
         const decoded = jwt.verify(token,process.env.JWT_SECRET)
         const user = await userModel.findById(decoded.id)

         // const hashedPassword = await bcrypt.hash(password,10);

         user.password = password;

         await user.save();

         res.status(200).json({message:"paswword updated successfully"})
         
      
     } catch (error) {
      res.status(500).json({ message: error.message, error: error.message })
      
     }
   

})

export default router



// connect ENETUNREACH 2607:f8b0:400e:c09::6c:465 (or similar IPv6 addresses) this error occurs
/*
Why it happened: By default, Node.js (v17+) prioritizes IPv6 address resolution. When Nodemailer 
tried to connect to Gmail's SMTP servers, 
it attempted to connect via IPv6. However, hosting 
environments like Render do not support or have restricted outbound IPv6 traffic,
 causing the connection to fail with ENETUNREACH (Network Unreachable).


 What Was Changed


  const transportter = nodemailer.createTransport({
    service:"gmail",
    auth:{
       user:process.env.EMAIL_USER,
       pass:process.env.EMAIL_PASS
-   }
+   },
+   family: 4
 });


 How This Resolved the Issue
IPv4 Force Resolution (family: 4): Adding the family: 4 configuration instructs Nodemailer's
 underlying socket connection layer to resolve domain names and connect exclusively using IPv4.
Since Render's servers fully support outbound IPv4 traffic, forcing IPv4 bypasses the network restrictions and
 successfully establishes the connection to Gmail's mail servers.


 IPv4 traffic refers to network communication that uses Internet Protocol version 4 (IPv4) to send and receive data.

Here is a simple breakdown:

1. What is an IP Address?
Every device connected to the internet (your computer, a server on Render, or Gmail's mail server) needs a unique address to send and receive data, similar to a physical mailing address.

2. IPv4 vs. IPv6
There are currently two versions of these addresses used on the internet:

IPv4 (The Older Standard): Uses 32-bit addresses formatted as four numbers separated by dots (e.g., 172.217.16.142 or 8.8.8.8).
IPv6 (The Newer Standard): Created because the world ran out of unique IPv4 addresses. It uses longer, hexadecimal characters separated by colons (e.g., 2607:f8b0:400e:c09::6c).
3. What is "IPv4 Traffic"?
When we talk about "IPv4 traffic," we mean the actual data packets moving across the internet using those standard xxx.xxx.xxx.xxx IPv4 addresses.

Why this mattered for your app:
Some cloud platforms like Render only have standard IPv4 networking set up for their outbound traffic.
When Node.js tried to send an email, it automatically chose IPv6 (IPv6 traffic) to connect to Google. Since Render's servers couldn't route IPv6 data, the network request was blocked.
By forcing IPv4, we ensured the data traveled over the standard IPv4 network, which Render supports perfectly.

 */