import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/userModels";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request); 
        if(!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = await User.findOne({ _id: userId }).select("-password"); // Fetch user excluding password

        return NextResponse.json({
            message: "User fetched successfully",
            data: user,
        }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}
