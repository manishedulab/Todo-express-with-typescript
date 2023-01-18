import express,{Request,Response,NextFunction,Application} from 'express';
import  mongoose from 'mongoose';
import  cors from 'cors';
import  jwt from 'jsonwebtoken';
import { databasemodel } from './Models/Todomodel';
import Routes from './Routes';
const bcrypt=require('bcrypt');
const { body, validationResult } = require('express-validator');
const app:Application = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(Routes);


mongoose.connect('mongodb://localhost:27017/app').then(() => {
    console.log('connection established');
}).catch((err) => {
    console.log('connection error  :' + err);
})

declare module "express" { 
    export interface Request {
      user: number
    }
  }
// registration form
app.post('/register',  body('email').isEmail(), body('fullname').isLength({ max:30  }),  body('password').isLength({ min: 6 ,max:60 }),  async (req:Request, res:Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    const verify = await databasemodel.findOne({ email: req.body.email})
    if(verify) {
        res.json({
            status:400,
            message:"user is already registered"
        })
    }else{
    // const hash=await bcrypt.hash(req.body.password,10)
    const db = await new databasemodel(
        {    
            fullName: req.body.fullname,
            email: req.body.email,
            password:req.body.password,
        }
    )
    const forverify = await db.save()

    if (forverify) {
        await jwt.sign({db}, 'privatekey', { expiresIn: '2h' }, (error, token) => {
            if (token) {
                const data = forverify
                req.user =data.UserId
                const userID =req.user
                module.exports.userID =userID
                res.json({
                    token,
                    status:200
                })
            } else {
                res.json({
                    message: "somthing went wrong please try again in a few minutes"
                })
            }
        });
    }
    }
    
    }catch(err){
        res.json({message: "somthing went wrong "})
    }
})

// login form
app.post('/login', body('email').isEmail(), body('password').isLength({ min: 6 , max:14 }), async (req:Request, res:Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
       
        const verify = await databasemodel.findOne({ email: req.body.email, password: req.body.password})
        if(verify){
           const password = verify.password
        //    const comparePass=await bcrypt.compare(req.body.password,password)
           if(!verify){
            res.json({
                message: "please check your credentials",
            })
           }
         else {
            const data =  verify
            req.user =data.UserId
            const userID =req.user
            module.exports.userID =userID
            await jwt.sign({data}, 'privatekey', { expiresIn: '2h' }, (error, token) => {
                if (token) {
                    res.send({
                        token,
                        data,
                        status:200
                    })
                } 
                else {
                    res.json({
                        message: "somthing went wrong please try again in a few minutes"
                    })
                }
            });
        }
    }
    } catch (error) {
        console.log("hello I'm error", error)
        throw error;
        
    }
    
})

app.listen(PORT, ():void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});