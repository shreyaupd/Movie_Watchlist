import { PrismaClient } from '../generated/client.js';
import jwt from 'jsonwebtoken';

const Prisma = new PrismaClient();

const getCookieValue = (cookieHeader, key) => {
    if (!cookieHeader) return undefined;
    const parts = cookieHeader.split(';').map((part) => part.trim());
    const target = parts.find((part) => part.startsWith(`${key}=`));
    if (!target) return undefined;
    return decodeURIComponent(target.slice(key.length + 1));
};

export const authentication = async (req, res, next) => {
    let token;

    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            token = req.cookies?.jwt || getCookieValue(req.headers.cookie, 'jwt');
        }

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Invalid token' });
    }
};
