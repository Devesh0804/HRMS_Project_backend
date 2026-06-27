import express from "express";

const router = express.Router();

export  const ApiRoute={
        DeparteAdd:"/add-department"

}


const save =  async (req, res) => {

    
        const { ...bodyReq } = req.body;
        const existData = await ObjectModel.findOne(bodyReq);
        if (existData) {
            response = ResponceApi(false)
            response.setMessage("Data Already Exista")
        } else {
            const saveObj = new ObjectModel(bodyReq);
            await saveObj.save();
            response = ResponceApi(false)
            response.setMessage("Data Save Success")
        }

    


}
export default save