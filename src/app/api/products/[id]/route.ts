import { NextRequest, NextResponse } from "next/server";

import { getDataFromToken } from "@/helpers/getDataFromToken";
import Product from "@/app/models/productModels";
import { connect } from "@/dbConfig/dbConfig";


connect();
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching product" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getDataFromToken(req); 

    const { id } = params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (product.sellerId.toString() !== userId) {
      return NextResponse.json({ message: "You are not authorized to update this product" }, { status: 403 });
    }

    const body = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
   
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
    
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
  }
}



export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getDataFromToken(req); 

    const { id } = params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (product.sellerId.toString() !== userId) {
      return NextResponse.json({ message: "You are not authorized to delete this product" }, { status: 403 });
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
  }
}

