import express from "express";
import departMentModel from "../../models/DepartmentModel/departmentModel.js";

const router = express.Router();


router.post('/savedata', async (req, res) => {
    try {
        
        const { deptName, deptCode, subDep, salary, createdBy, updatedBy } = req.body


        await departMentModel.create({
            deptName: deptName,
            deptCode: deptCode,
            subDep: subDep,
            salary: salary,
            createdBy:createdBy,
            updatedBy:updatedBy, 

        })
        res.status(200).json({ message: "data saved successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


router.get('/getData',async(req,res)=>{
    try {
        const department = await departMentModel.find();
        // console.log(department);
        res.send(department)
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})

router.get('/searchById/:id', async (req, res) => {
    try {
        const department = await departMentModel.findById(req.params.id);

        if (!department) {
            return res.status(404).json({ message: "department not found" });
        }

        res.status(200).json({ department });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post('/updatedata/:id', async (req, res) => {
    try {
        const { deptName, deptCode, subDep, salary, createdBy, updatedBy } = req.body;

        const department = await departMentModel.findByIdAndUpdate(
            req.params.id,
            {
                deptName: deptName,
                deptCode: deptCode,
                subDep: subDep,
                salary: salary,
                createdBy: createdBy,
                updatedBy: updatedBy
            },
            { new: true }
        );

        if (!department) {
            return res.status(404).json({ message: "department not found" });
        }

        res.status(200).json({ message: "data updated successfully", department });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete('/deleteById/:id', async (req, res) => {
    try {
        const department = await departMentModel.findByIdAndDelete(req.params.id);

        if (!department) {
            return res.status(404).json({ message: "department not found" });
        }

        res.status(200).json({ message: "data deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


export default router;
