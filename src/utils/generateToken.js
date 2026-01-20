// generateToken.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

// Debug: check if env loaded
// console.log("JWT_SECRET:", process.env.JWT_SECRET);
// console.log("JWT_EXPIRES:", process.env.JWT_EXPIRES || '7d');

// Function to generate token
export const generateToken = (userId, res) => {
    const payload = { id: userId }; // user identity
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES || '7d'
        });
        // console.log("Generated Token:", token);
         res.cookie("jwt",token,{
            httpOnly:true, // inaccessible to client-side JS
            secure:process.env.NODE_ENV === 'production', // use secure cookies in production
            sameSite:'strict', // CSRF protection
            maxAge: (process.env.JWT_COOKIE_EXPIRES || 7) * 24 * 60 * 60 * 1000 // default 7 days
         });
        return token;
    } catch (err) {
        console.error("Error generating token:", err.message);
        return null;
    }
}

// Test call (can remove later)
// generateToken('a510dc07-d3f2-4795-a5be-29ba4809b1c6');
