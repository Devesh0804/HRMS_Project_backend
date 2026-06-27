import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import userModel from '../models/UserModel/userModel.js';

dotenv.config();



const userAuth = async(req,res,next) =>{
    try {

 
        let barearHead = req.headers['authorization']
              
        if (typeof barearHead !== 'undefined') {
            const token = barearHead.split(' ')[1];
            if (!token) {
              return res.status(401).json({ message: 'Unauthorized: token missing' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } else {
            res.status(401).json({ message: 'Unauthorized: authorization header missing' });
        }

     
    } catch (error) {
         res.status(403).json({message:"token is not set"})
         
    }
}


export default userAuth;