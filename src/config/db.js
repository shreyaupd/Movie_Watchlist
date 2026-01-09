import { PrismaClient } from '../generated/client.ts';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully using Prisma');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
