import { PrismaClient } from '../generated/client.js';
import jwt from 'jsonwebtoken';

 const Prisma = new PrismaClient();
export const authentication = async (req, res, next)=>{
    let token;
    try {
         const authHeader = req.headers.authorization;
         if(authHeader && authHeader.startsWith('Bearer '))
         {
             token = authHeader.split(" ")[1];
         }
         else
         {
             token = req.cookies?.jwt;
         }
            if(!token)
            {
                return res.status(401).json({error:"No token provided"});
            }
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         const user = await Prisma.user.findUnique({
            where:{id: decoded.id}
         })
         if(!user){
            res.status(401).json({error:"User not found"});
         }
         const {password, ...UserWithoutPassword} = user;
         req.user = UserWithoutPassword;
         next();
    }
     catch (error) {
        console.log(error);
        res.status(401).json({error:"Invalid token"});
        
    }
}