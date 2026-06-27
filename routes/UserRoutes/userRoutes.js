import express from 'express'
import mongoose from 'mongoose'
import userModel from '../../models/UserModel/userModel.js'
import { cityModel, StateModel, CountryModel } from '../../models/UserModel/AddressModel/AddressModel..js'
import bankModel from '../../models/UserModel/BankDetails/bankModel.js'
import documentModel from '../../models/UserModel/DocumentModel/docModel.js'
import roleModel from '../../models/RoleModel/RoleModel.js'
import departMentModel from '../../models/DepartmentModel/departmentModel.js'





const router = express.Router();



router.post('/savedata', async (req, res) => {
    console.log('route hit');

    try {

        const { address } = req.body
        console.log(address);
        
        const city = await cityModel.create({ CityName: address.CityName })
        const state = await StateModel.create({ StateName: address.StateName })
        const country = await CountryModel.create({ CountryName: address.CountryName });


        const { Documents } = req.body
        // console.log(Documents);

        const documents = await documentModel.create({
            Marks_10th: Documents.Marks_10th,
            Marks_12th: Documents.Marks_12th,
            UG_qualifications: Documents.UG_qualifications,
            PG_qualifications: Documents.PG_qualifications
        })


        const { BankDetails } = req.body
        const bankDetails = await bankModel.create({
            bankname: BankDetails.bankname,
            ifsccode: BankDetails.ifsccode,
            branchName: BankDetails.branchName,
            acccountno: BankDetails.acccountno,
            passbook_checkImg: BankDetails.passbook_checkImg
        })

        const { department } = req.body;
        const departmentDetails = department ? await departMentModel.findOne({ deptName: department }) : null;
        const departmentID = departmentDetails?._id || null;
        // console.log(departmentID);



        const roleName = req.body.roleName || 'User';
        const roleID = await roleModel.findOne({ roleName: roleName });



        const { FullName, useremail, username, password, mobile, AlternateMobile, gender, DOB, status, AccountStatus, startsession, endsession } = req.body;
            console.log('Documents',req.body.Documents.PG_qualifications);
        let user;
        if (FullName, useremail, username, password, mobile, AlternateMobile, gender, DOB) {
            user = await userModel.create({
                FullName: FullName,
                useremail: useremail,
                username: username,
                password: password,
                mobile: mobile,
                AlternateMobile: AlternateMobile,
                gender: gender,
                DOB: DOB,
                address: {
                    city: city._id,
                    state: state._id,
                    country: country._id
                },
                Documents: documents._id,
                BankDetails: bankDetails._id,
                status: status,
                AccountStatus:AccountStatus,
                startsession: startsession,
                endsession: endsession,
                role: roleID?._id,
                roleName: roleName,
                department: departmentID



            })
        }


        // console.log(user);
        if (departmentID) {
            await departMentModel.findByIdAndUpdate(departmentID,
                {
                    $push: { users: user._id },
                }
                , { new: true })
        }

        res.status(200).json({ message: "data saved successfully", user });

    } catch (error) {
        console.log(error.message);

        res.status(500).json({ error: error.message });
    }



})




// router.get('/searchById/:id', async (req, res) => {
//     try {
//         const user = await userModel.findById({ _id: req.params.id })
//         res.status(200).json({ message: "user searched Successfully", user })
//     } catch (error) {
//         res.status(500).json({ error: error.message })
//     }
// })




//SearchByID
router.get('/searchById/:id', async (req, res) => {
    try {
        // const { username } = await userModel.findOne;
        const userID = new mongoose.Types.ObjectId(req.params.id);
        const user = await userModel.findById({ _id: userID }).populate([
            { path: "Documents" },
            { path: "BankDetails" },
            { path: "address.city" },
            { path: "address.state" },
            { path: "address.country" },
            { path: "department" },
            { path: "role" }
        ]);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


//updateData
router.post('/updatedata/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        //update Address
        await cityModel.findByIdAndUpdate(
            user.address.city,
            {
                CityName: req.body.address.CityName
            }
        );

        await StateModel.findByIdAndUpdate(
            user.address.state,
            {
                StateName: req.body.address.StateName
            }
        );

        await CountryModel.findByIdAndUpdate(
            user.address.country,
            {
                CountryName: req.body.address.CountryName
            }
        );

        //Update Documents
        await documentModel.findByIdAndUpdate(
            user.Documents,
            req.body.Documents
        );
        //Update BankDetails
        await bankModel.findByIdAndUpdate(
            user.BankDetails,
            req.body.BankDetails
        );


        //Update Department
        const departmentDetails =
            req.body.department ? await departMentModel.findOne({
                deptName: req.body.department
            }) : null;

        //updateMain user
    
        
        const userUpdateData = {
            FullName: req.body.FullName,
            useremail: req.body.useremail,
            username: req.body.username,
            password: req.body.password,
            mobile: req.body.mobile,
            AlternateMobile:
                req.body.AlternateMobile,
            gender: req.body.gender,
            DOB: req.body.DOB,
            status: req.body.status,
            AccountStatus: req.body.AccountStatus,
            roleName: req.body.roleName || user.roleName || 'User'
        };

        if (departmentDetails?._id) {
            userUpdateData.department = departmentDetails._id;
        }

        const updatedUser =
            await userModel.findByIdAndUpdate(
                req.params.id,
                userUpdateData,
                {
                    new: true
                }
            );



        res.status(200).json({ message: "data updated successfully" })
    } catch (error) {
        console.log(error.message);

    }
})



/**
 *  save-> savedata
 *  update->updatedata
 *  show->search
 *    ->searchById/{id}
 *    ->SearchBy/{columnname}/{columnvalue}/{sortorder}
 *  deleteById
 */






router.get('/getData', async (req, res) => {
    try {
        const users = await userModel.find().populate([
            { path: "Documents" },
            { path: "BankDetails" },
            { path: "address.city" },
            { path: "address.state" },
            { path: "address.country" },
            { path: "department" },
            { path: "role" }
        ]);
        // console.log(users)
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})










// router.put('/updatedata/:id', async (req, res) => {
//     try {
//         const oldUser = await userModel.findById(req.params.id);

//         if (!oldUser) {
//             return res.status(404).json({ message: 'user not found' });
//         }

//         const { address, Documents, BankDetails, ...userData } = req.body;

//         if (address && oldUser.address) {
//             if (oldUser.address.city) {
//                 await cityModel.findByIdAndUpdate(oldUser.address.city, { CityName: address.CityName });
//             }
//             if (oldUser.address.state) {
//                 await StateModel.findByIdAndUpdate(oldUser.address.state, { StateName: address.StateName });
//             }
//             if (oldUser.address.country) {
//                 await CountryModel.findByIdAndUpdate(oldUser.address.country, { CountryName: address.CountryName });
//             }
//         }

//         if (Documents && oldUser.Documents) {
//             await documentModel.findByIdAndUpdate(oldUser.Documents, Documents);
//         }

//         if (BankDetails && oldUser.BankDetails) {
//             await bankModel.findByIdAndUpdate(oldUser.BankDetails, BankDetails);
//         }

//         const user = await userModel.findByIdAndUpdate(req.params.id, userData, { new: true });

//         if (!user) {
//             return res.status(404).json({ message: 'user not found' });
//         }

//         res.status(200).json({ message: 'data updated successfully', user });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// })


router.delete('/deleteById/:id', async (req, res) => {
    try {
        // const user = await userModel.findByIdAndDelete(req.params.id);
        const user = await userModel.findById(req.params.id)

        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        //Delete Address
        if (user.address?.city) await cityModel.findByIdAndDelete(user.address.city)
        if (user.address?.state) await StateModel.findByIdAndDelete(user.address.state)
        if (user.address?.country) await CountryModel.findByIdAndDelete(user.address.country)

        //Delete document
        if (user.Documents) await documentModel.findByIdAndDelete(user.Documents)

        //BankDetails
        if (user.BankDetails) await bankModel.findByIdAndDelete(user.BankDetails)

        //Delete Department
        if (user.department) {
            await departMentModel.findByIdAndUpdate(user.department,
                {
                    $pull: { users: user._id }
                },
                { new: true }
            )
        }

        await userModel.deleteOne({ _id: user._id })




        res.status(200).json({ message: 'data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})





// router.get('/searchBy', async (req, res) => {
//     try {
//         const columName = req.query.columName;
//         const columValue = req.query.columValue;

//         const user = await userModel.findOne({ columName: columValue });
//         res.status(200).json({ message: user });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// })



// router.get('/get-user', async (req, res) => {
//     try {
//         const { username } = req.body
//         const user = await userModel.findOne({ username: username }).populate([
//             { path: "Documents" },
//             { path: "BankDetails" },
//             { path: "address.city" },
//             { path: "address.state" },
//             { path: "address.country" }
//         ])

//         res.status(200).json({user})

//     } catch (error) {
//           res.status(500).json({error : error.message})
//     }
// })

export default router;



























/**
 * 
 * import express, { json } from 'express'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import departMentModel from '../models/departmentModel.js';
import userModel from '../models/userModel.js';
import roleModel from '../models/RoleModel.js';
import jwt from 'jsonwebtoken'


dotenv.config();



const router = express.Router();


// //SuperAdmin Register
// router.post('/superadmin-register', async (req, res) => {
//    try {
//       const { FullName, useremail, username, password, mobile, role } = req.body;

//       const existData = await userModel.findOne({ username: username })
//       if (existData) {
//          return res.status(400).json({ message: "user already exist" });
//       }

//       // const departmentData = await departMentModel.findOne({ deptCode: department });

//       const Name = FullName.firtName + " " + FullName.lastName

//       let EmpRole = new roleModel({ roleName: role, createdBy: { Name: Name }, updatedBy: { Name: Name } })
//       await EmpRole.save();
//       console.log(EmpRole);



//       const hashpassword = await bcrypt.hash(password, 10);

//       let user = new userModel({ FullName, useremail, password: hashpassword, username, mobile, role: EmpRole._id });
//       await user.save();





//       let result = await (await user.populate('department')).populate('role')
//       console.log(result);


//       res.status(200).json({ message: "data saved successfully", result })


//    } catch (error) {
//       res.status(500).json(error.message)
//    }
// })




//SuperAdmin-Login
// router.post('/login', async (req, res) => {
//    try {
//       const { useremail, username, password } = req.body;

//       let user = await userModel.findOne({$or:[{ username : username } ,{ useremail : useremail}] })
//       if(!user){
//          return res.status(404).json({message:"user not found  "})
//       }
      
//        console.log(user);
       
//        let isPassword = await bcrypt.compare(password,user.password)
   

       
//        if(!isPassword){
//          return res.status(400).json({message:"incorrect password"})
//        }

//        if((username || useremail) && password){
//            const token = jwt.sign({_id:user._id,name:user.username},process.env.JWT_SECRET,{expiresIn:'1h'}) 
//            res.send({token});
//        }
//        res.send('a')
//    } catch (error) {
//          res.status(500).json({error:error.message})
//    } 
// })




















router.post('/find-user', async (req, res) => {
   let { roleName } = req.body
   let role = await roleModel.findOne({ roleName: roleName });

   console.log(role);

   res.send(role);
})



export default router;
 * 
 */
