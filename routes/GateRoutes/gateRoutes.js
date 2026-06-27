import express from 'express';
import fs from 'fs';
import path from 'path';
import qr from 'qr-image';
import { fileURLToPath } from 'url';
import GateModel from '../../models/GateModel/gatemodel.js';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const qrFolderPath = path.join(__dirname, 'qrImages');

const gates = [
    { gateName: 'Main Gate', gateCode: 'GATE-001' },
    { gateName: 'Staff Gate', gateCode: 'GATE-002' },
    { gateName: 'Visitor Gate', gateCode: 'GATE-003' }
];

const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

// const createQrData = (gate) => {
//     const scanUrl = new URL('/employee/attendance/verify', getFrontendUrl());
//     scanUrl.searchParams.set('gateCode', gate.gateCode);
//     scanUrl.searchParams.set('gateName', gate.gateName);
//     return scanUrl.toString();
// };



const createQrData = (gate) => {
    return JSON.stringify({
        gateCode: gate.gateCode,
        gateName: gate.gateName,
        qrType: "ATTENDANCE"
    });
};


function createQrImage(gate) {
    if (!fs.existsSync(qrFolderPath)) {
        fs.mkdirSync(qrFolderPath, { recursive: true });
    }

    const fileName = `${gate.gateCode}.png`;
    const filePath = path.join(qrFolderPath, fileName);

    const qrData = createQrData(gate);

    const qrImage = qr.imageSync(qrData, {
        type: "png",
        size: 10
    });
    // console.log(filePath)
    fs.writeFileSync(filePath, qrImage);

    return {
        qrImageUrl: `/gate-qr/${fileName}`,
        qrData: JSON.parse(qrData)
    };
}



// function createQrImage(gate) {
//     if (!fs.existsSync(qrFolderPath)) {
//         fs.mkdirSync(qrFolderPath, { recursive: true });
//     }

//     const fileName = `${gate.gateCode}.png`;
//     const filePath = path.join(qrFolderPath, fileName);
//     const qrData = createQrData(gate);
    
//     const qrImage = qr.imageSync(qrData, { type: 'png', size: 10 });
    
//     fs.writeFileSync(filePath, qrImage);
//     // ''
//     // await GateModel.create({gateName:gate.gateName,gateCode:gate.gateCode})
    
//     return `/gate-qr/${fileName}`;
// }

router.get('/getData', async (req, res) => {
    try {
       
        const gatesWithQrImages = gates.map((gate) => {
            const qrImageUrl = createQrImage(gate);
            const qrData = createQrData(gate);
        //    console.log(qrImageUrl)
        //    console.log(qrData)
            return {
                gateName: gate.gateName,
                gateCode: gate.gateCode,
                qrImageUrl,
                qrData
            };
        });

        res.status(200).json(gatesWithQrImages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
