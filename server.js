import express from 'express'
import dotenv from 'dotenv'
import connectDB from './dbConfig/dbConnect.js';
import session from 'express-session';
import UserRouter from './routes/UserRoutes/userRoutes.js';
import ProjectRouter from './routes/ProjectRoutes/projectRoutes.js';
import RoleRouter from './routes/RoleAddRoutes/roleroutes.js';
import DepartMentRouter from './routes/DepartmentRoutes/departmentRoutes.js';
import ClientRouter from './routes/ClientRoutes/clientRoutes.js';
import AttendenceRouter from './routes/AttendeceRoutes/AttendenceRoutes.js';
import AddressRouter from './routes/Country-State-City/country-state-city.js';
import Authrouter from './routes/Authroutes/UserAuthentication.js';
import userAuth from './middlewares/userAuth.js';
import cors from 'cors'
import GateRouter from './routes/GateRoutes/gateRoutes.js';

dotenv.config();
const app = express();
connectDB();

app.use(session({
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitialized:false
}))


//middlewares
// http://localhost:5173
app.use(cors({
    origin :"https://hrms-project-frontend-beta.vercel.app" ,
    methods : ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true

}))
    
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use('/gate-qr', express.static('routes/GateRoutes/qrImages'));

// userAuth
app.use('/hrms/authentication', Authrouter);
app.use('/hrms/user', UserRouter);
app.use('/hrms/project', ProjectRouter);
app.use('/hrms/role', RoleRouter);
app.use('/hrms/address',userAuth, AddressRouter);
app.use('/hrms/department', DepartMentRouter);
app.use('/hrms/client', ClientRouter);
app.use('/hrms/project', ProjectRouter);
app.use('/hrms/gates', GateRouter);

//Employee Routes
app.use('/hrms/attendence',userAuth, AttendenceRouter);


// app.use('/',LoginRouter)
// app.use('/user',SuperAdminRouter)

// app.use(userAuth)
// // app.use('/super-admin',createUserRouter)
// app.use('/department',deptRouter);




app.listen(process.env.PORT, ()=>{
    console.log(`server started at ${process.env.PORT}`);
})
