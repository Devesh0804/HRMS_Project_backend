import express from 'express'
import ProjectModel from '../../models/ProjectModel/ProjectModel.js'

const router = express.Router();

router.post('/savedata', async (req, res) => {
    try {
        const {
            projectName,
            projectCode,
            clientName,
            projectManager,
            startDate,
            endDate,
            priority,
            status,
            budget,
            teamSize,
            description
        } = req.body;

        const existingProject = await ProjectModel.findOne({ projectCode });

        if (existingProject) {
            return res.status(400).json({ message: "project code already exist" });
        }

        await ProjectModel.create({
            projectName,
            projectCode,
            clientName,
            projectManager,
            startDate,
            endDate,
            priority,
            status,
            budget,
            teamSize,
            description
        });

        res.status(200).json({ message: "project saved successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/getData', async (req, res) => {
    try {
        const projects = await ProjectModel.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/searchById/:id', async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "project not found" });
        }

        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post('/updatedata/:id', async (req, res) => {
    try {
        const {
            projectName,
            projectCode,
            clientName,
            projectManager,
            startDate,
            endDate,
            priority,
            status,
            budget,
            teamSize,
            description
        } = req.body;

        const project = await ProjectModel.findByIdAndUpdate(
            req.params.id,
            {
                projectName,
                projectCode,
                clientName,
                projectManager,
                startDate,
                endDate,
                priority,
                status,
                budget,
                teamSize,
                description
            },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: "project not found" });
        }

        res.status(200).json({ message: "project updated successfully", project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete('/deleteById/:id', async (req, res) => {
    try {
        const project = await ProjectModel.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "project not found" });
        }

        res.status(200).json({ message: "project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})




export default router
