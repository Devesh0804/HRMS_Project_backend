import express, { json } from 'express'
import userModel from '../../models/UserModel/userModel.js'
import roleModel from '../../models/RoleModel/RoleModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router();




//SuperAdmin-Login
router.post('/login', async (req, res) => {
   try {
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





const transportter = nodemailer.createTransport({
   host:"smtp.gmail.com",
   port:587,
   requireTLS:true,
   family:4,
   auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS
   }
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


      await transportter.verify();
      console.log("SMTP Connected");
      
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