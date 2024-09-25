import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Session from "@/app/models/session";

connect();

export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request); // Get user ID from token

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    console.log('User ID found:', userId); // Log the found user ID

    await Session.deleteMany({ userId: userId });

    return NextResponse.json({ message: "All sessions have been terminated" }, { status: 200 });
  } catch (error: unknown) { 
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "An unknown error occurred" }, { status: 500 });
  }
}
