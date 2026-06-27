import express from "express";
import ClientModel from "../../models/ClientModel/ClientModel.js";

const router = express.Router();

router.post('/savedata', async (req, res) => {
    try {
        const {
            companyName,
            clientCode,
            industry,
            contactPerson,
            email,
            phone,
            gstNumber,
            companySize,
            website,
            address,
            city,
            state,
            country,
            postalCode,
            status
        } = req.body;

        const existingClient = await ClientModel.findOne({ clientCode });

        if (existingClient) {
            return res.status(400).json({ message: "client code already exist" });
        }

        await ClientModel.create({
            companyName,
            clientCode,
            industry,
            contactPerson,
            email,
            phone,
            gstNumber,
            companySize,
            website,
            address,
            city,
            state,
            country,
            postalCode,
            status
        });

        res.status(200).json({ message: "client saved successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getData', async (req, res) => {
    try {
        const clients = await ClientModel.find().sort({ createdAt: -1 });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/searchById/:id', async (req, res) => {
    try {
        const client = await ClientModel.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ message: "client not found" });
        }

        res.status(200).json({ client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/updatedata/:id', async (req, res) => {
    try {
        const {
            companyName,
            clientCode,
            industry,
            contactPerson,
            email,
            phone,
            gstNumber,
            companySize,
            website,
            address,
            city,
            state,
            country,
            postalCode,
            status
        } = req.body;

        const client = await ClientModel.findByIdAndUpdate(
            req.params.id,
            {
                companyName,
                clientCode,
                industry,
                contactPerson,
                email,
                phone,
                gstNumber,
                companySize,
                website,
                address,
                city,
                state,
                country,
                postalCode,
                status
            },
            { new: true }
        );

        if (!client) {
            return res.status(404).json({ message: "client not found" });
        }

        res.status(200).json({ message: "client updated successfully", client });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/deleteById/:id', async (req, res) => {
    try {
        const client = await ClientModel.findByIdAndDelete(req.params.id);

        if (!client) {
            return res.status(404).json({ message: "client not found" });
        }

        res.status(200).json({ message: "client deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
