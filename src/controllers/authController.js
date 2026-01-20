import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import {generateToken} from '../utils/generateToken.js'
//register
const register = async (req, res) => {
 const {name, email, password}=req.body;
 const userExists= await prisma.user.findUnique({
    where:{email}
 });
 if(userExists){
    return  res
    .status(400)
    .json({error:"User already exists for this email"});
 }
  //hash password
 const salt= await bcrypt.genSalt(10) // 10 rounds of hashing
 const hashedPassword = await bcrypt.hash(password,salt)
// add user to table
const user= await prisma.user.create({
    data:{
        name,
        email,
        password:hashedPassword,
    }
})
res.status(201).json({message:"User registered successfully", 
    user:{
        id:user.id,
        name:user.name,
        email:user.email
    }
});
}
//login
const login = async (req, res)=>{
    const {email, password}= req.body;
    const userExists= await prisma.user.findUnique({
        where:{email:email}
    })
    if(!userExists){
        return res.status(401)
        .json({message:"Invalid email or password"});
    }
     const isPasswordValid= await bcrypt.compare(password, userExists.password);//userentered password, hashedPassword in db.
     if(!isPasswordValid){
        return res.status(401)
        .json({message:"Invalid email or password"});
     }
     const token = generateToken(userExists.id, res)
     res.status(200).json({status:"Login Successful",
        data:{
            user:{
                id: userExists.id,
                email: email,
            },
            token,
        }  
    })
}
export { register, login };