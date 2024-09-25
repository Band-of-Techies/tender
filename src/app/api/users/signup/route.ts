import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/userModels";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password, username, roles } = reqBody;

    // Email validation (simple regex for email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Username validation (no numbers, special characters, between 3-20 chars)
    const usernameRegex = /^[A-Za-z\s]{3,20}$/; 
    if (!username || !usernameRegex.test(username)) {
      return NextResponse.json(
        { message: "Username must be 3-20 characters, letters and spaces only" },
        { status: 400 }
      );
    }


    // Role validation (only "seller" or "buyer" allowed)
    const validRoles = ["seller", "buyer"];
    if (!roles || !validRoles.includes(roles)) {
      return NextResponse.json(
        { message: "Role must be either 'seller' or 'buyer'" },
        { status: 400 }
      );
    }


    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      return NextResponse.json(
        {
          message: "Password must be 8 characters long, with uppercase, lowercase, number, and special character",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      roles,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    return NextResponse.json(
      { message: "User created successfully", success: true, savedUser },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
