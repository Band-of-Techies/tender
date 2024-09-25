import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/userModels";
import jwt from "jsonwebtoken";
import Session from "@/app/models/session";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }

        // Check password validity
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ message: "Invalid password" }, { status: 400 });
        }

        const tokenData = {
            _id: user._id,
            email: user.email,
            roles: user.roles,
            username: user.username,
        };
        // Create JWT token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET as string, { expiresIn: "1d" });

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        }, { status: 200 });
        // Check for active sessions
        const activeSession = await Session.findOne({ userId: user._id });

        const activeSessionRes = NextResponse.json({
            message: "There is already an active session using your account. Do you want to terminate all sessions?",
            success: false,
            token: token,

        }, { status: 403 });

        if (activeSession) {

            activeSessionRes.cookies.set("token", token, {
                httpOnly: true,
            });
            return activeSessionRes;

        }


        // Store session in database (MongoDB)
        await Session.create({ userId: user._id, token });

        // Send response with token in cookies
        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
