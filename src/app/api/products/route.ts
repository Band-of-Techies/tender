import { NextRequest, NextResponse } from "next/server";

import { getDataFromToken } from "@/helpers/getDataFromToken";
import Product from "@/app/models/productModels";
import { connect } from "@/dbConfig/dbConfig";

connect();
export async function GET(req: NextRequest) {
  try {
    const products = await Product.find({});
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const userId = getDataFromToken(req); // Ensure userId type matches your auth utility

    const body = await req.json();
    const { productName, amountAvailable, cost } = body;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!productName || !amountAvailable || !cost) {
      return NextResponse.json({ message: "All fields (productName, amountAvailable, cost) are required" }, { status: 400 });
    }

    const newProduct = await Product.create({
      productName,
      amountAvailable,
      cost,
      sellerId: userId, // Assuming userId is the seller
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
