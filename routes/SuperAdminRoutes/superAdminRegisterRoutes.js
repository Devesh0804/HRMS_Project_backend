import express from 'express'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import departMentModel from '../models/departmentModel.js';
import userModel from '../../models/userModel.js';
import roleModel from '../models/RoleModel.js';
import jwt from 'jsonwebtoken'


dotenv.config();



const router = express.Router();


//SuperAdmin Register
router.post('/superadmin-register', async (req, res) => {
   try {
      const { FullName, useremail, username, password, mobile, role } = req.body;

      const existData = await userModel.findOne({ username: username })
      if (existData) {
         return res.status(400).json({ message: "user already exist" });
      }

      // const departmentData = await departMentModel.findOne({ deptCode: department });

      const Name = FullName.firtName + " " + FullName.lastName

      let EmpRole = new roleModel({ roleName: role, createdBy: { Name: Name }, updatedBy: { Name: Name } })
      await EmpRole.save();
      console.log(EmpRole);



      const hashpassword = await bcrypt.hash(password, 10);

      let user = new userModel({ FullName, useremail, password: hashpassword, username, mobile, role: EmpRole._id });
      await user.save();





      let result = await (await user.populate('department')).populate('role')
      console.log(result);


      res.status(200).json({ message: "data saved successfully", result })


   } catch (error) {
      res.status(500).json(error.message)
   }
})

