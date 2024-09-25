import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest): string | null => {
    try {
        const token = request.cookies.get("token")?.value || '';
        if(!token) return null;
        
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as jwt.JwtPayload; // Type decodedToken as JwtPayload
        
        return decodedToken._id || null; // Safely return _id if it exists
    }
    catch (error: unknown) {
        // Check if error is an instance of Error
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Unknown error occurred during token verification.");
        }
    }
};
