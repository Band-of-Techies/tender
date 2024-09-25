import { NextRequest, NextResponse } from "next/server";
import jwt ,{ JwtPayload } from "jsonwebtoken";
import Session from "@/app/models/session";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
    try {
        // Step 1: Get the token from cookies
        const token = request.cookies.get("token")?.value || '';

        // If no token, return active: false without clearing cookie
        if (!token) {
            return NextResponse.json({ active: false });
        }

        // Step 2: Decode the token and extract userId
        let decodedToken: JwtPayload & { _id?: string } | null = null;
        try {
            decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload & { _id?: string };
        } catch (error) {
           
            return NextResponse.json({ active: false });
        }

        const userId = decodedToken?._id;
        if (!userId) {
            // If no userId in token, return active: false
            return NextResponse.json({ active: false });
        }

        // Step 3: Check the session in the database using userId
        const activeSession = await Session.findOne({ userId });

        if (activeSession) {
            // Check if the session token matches the provided token
            const isTokenValid = activeSession.token === token;

            // Step 4: If tokens don't match, clear the cookie and return active: false
            if (!isTokenValid) {
                const response = NextResponse.json({ active: true });
                response.cookies.set("token", "", {
                    httpOnly: true,
                    expires: new Date(0) // Expire the token cookie
                });
                return response;
            }
            else{
                return NextResponse.json({ active: false });
            }
        }

        // Step 6: If session doesn't exist or expired, return active: false
        return NextResponse.json({ active: false });

    } catch (error: unknown) {
        console.error("Error verifying session:", error instanceof Error ? error.message : error);
        return NextResponse.json({ active: false, error: error instanceof Error ? error.message : "Unknown error" });
    }
}
