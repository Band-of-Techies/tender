import { NextRequest, NextResponse } from "next/server";
import { connect } from '@/dbConfig/dbConfig';
import User from '@/app/models/userModels';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function PUT(req: NextRequest) {
    try {
        const userId = getDataFromToken(req); 
        const body = await req.json();
        const { deposit } = body;

        if (typeof deposit !== 'number') {
            return NextResponse.json({ message: 'Deposit must be a number.' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }

        // Update the deposit
        user.deposit = deposit;
        await user.save();

        return NextResponse.json({ message: 'Deposit updated successfully!', deposit: user.deposit }, { status: 200 });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
