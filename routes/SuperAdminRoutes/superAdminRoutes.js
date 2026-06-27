import userModel from '../../models/userModel.js';
import departMentModel from '../../models/departmentModel.js';
import roleModel from '../../models/RoleModel.js';
import bcrypt from 'bcrypt'
import express from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import userAuth from '../../middlewares/userAuth.js';

dotenv.config()
const router = express.Router();






router.get('/',async(req,res)=>{
      
         let user = await userModel.find();
       if(user.length == 0){
        console.log('no user is available',user);
       
        // res.redirect('/add-superAdmin')
        
     }
     else{
        console.log(user);
        
     }
})



router.post('/add-superAdmin',async(req,res)=>{
    let role =  await roleModel.create({
        roleName :"Superadmin",
        createdBy:{Name :"Developer"},
        updatedBy:{Name:"Developer"}

    })
    console.log(role);
      
    let hashPassword = await bcrypt.hash('SUPER_ADMIN',10)
  let result =   await userModel.create({
        firtName:"",
        lastName:"",
        useremail:"",
        role:role._id,
        mobile:"",
        username:"superadmin",
        password:hashPassword
    })
    console.log(result);
    let firesult = await result.populate('role')
    res.send(firesult)
})


router.use(userAuth);

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

router.post('/add-admin',async(req,res)=>{
    try {
          const  { FullName, useremail, username, password, mobile, role ,department} = req.body;
            
             

                const existData = await userModel.findOne({ username: username })
                if (existData) {
                   return res.status(400).json({ message: "user already exist" });
                }

                
          
                const departmentData = await departMentModel.findOne({ deptCode: department });

                const createdBy = await userModel.findById({_id : req.user._id})
                // console.log('user',createdBy);
                
          
                const Name = createdBy.FullName.firtName + " " + createdBy.FullName.lastName
                // console.log('name',Name);
                
          
                let userRole = new roleModel({ roleName: role, createdBy: { Name: Name }, updatedBy: { Name: Name } })
                await userRole.save();
                console.log(userRole);
          
          
          
                const hashpassword = await bcrypt.hash(password, 10);
          
                let user = new userModel({ FullName, useremail, password: hashpassword, username,department:departmentData._id, mobile, role: userRole._id });
                await user.save();
          
               
             
          
          
                let result = await (await user.populate('department')).populate('role')
                console.log(result);
          
          
                res.status(200).json({ message: "data saved successfully", result })
    } catch (error) {
         res.status(500).json({error:error.message})
    }
})



router.post('/add-department', async (req, res) => {
    try {

        const { deptName, deptCode, subDep, salary } = req.body;

        const existdept = await departMentModel.findOne({ deptCode: deptCode });
        if (existdept) {
            return res.status(400).json({ message: "department already exist" });
        }

        const department = new departMentModel({ deptName, deptCode, subDep, salary });
        await department.save();
        return res.status(200).json({message:"Department added successfully"})

    } catch (error) {
    res.status(500).json(error.message);
    } 


    

})



export default router