import User from "@/app/models/userModels";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        try {
            const userId = getDataFromToken(req);

            const user = await User.findById(userId);

    
            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }

       
            if (user.roles !== "buyer") {
                return NextResponse.json({ message: "Not authorized" }, { status: 403 });
            }

            user.deposit = 0;
            await user.save();

            return NextResponse.json({ message: "Deposit reset to 0" }, { status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: "Internal server error" }, { status: 500 });
        }
    }
}
