import express from 'express'
import departMentModel from '../../models/departmentModel.js';
import dotenv from 'dotenv'


dotenv.config();






const router = express.Router();
import save from '../../Base/route/BaseRoute.js';
import { ApiRoute } from '../../Base/route/BaseRoute.js';


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




// // const saveDep = (req,res)=>{
// //        console.log('function call')
// //     save(ApiRoute.DeparteAdd,)

// // }


// router.post(ApiRoute.DeparteAdd,save)

// // const send = async(req,res)=>{
// //     res.send('hello')
// // }

// // router.get('/',send)


export default router;