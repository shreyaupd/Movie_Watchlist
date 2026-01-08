import PrismaClient from '@prisma/client';
import dotenv from 'dotenv';
// prismaclient is used for autocompletion and recognition of what 
// the table and columns in database(neon) are. 

const prisma = new PrismaClient({
    log:process.env.NODE_ENV==="development"?
    ['query','warn','error']:
    ['error']
});

const connectDB=async()=>{
    try {
        await prisma.$connectDB()
        console.log("Database connected sucessfully using prisma")
        
    } catch (error) {
        console.log(`Database connection failed ${error.message}`);
        process.exit(1);
    }
}

const disconnectDB=async()=>{
    await prisma.$disconnect();
}

export {prisma,connectDB,disconnectDB};