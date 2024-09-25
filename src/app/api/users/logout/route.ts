import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Session from "@/app/models/session";

export async function GET(request: NextRequest) {
    try {
        const userId = getDataFromToken(request); // Get user ID from token

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Delete all sessions for the user
        await Session.deleteMany({ userId });

        // Create the response and clear the token cookie
        const response = NextResponse.json({
            message: "Logout successful",
            success: true
        });

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0) // Set expiration date to the past to clear the cookie
        });

        return response;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
