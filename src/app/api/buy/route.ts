import { NextRequest, NextResponse } from "next/server";
import { connect } from '@/dbConfig/dbConfig';
import User from '@/app/models/userModels';
import Product from '@/app/models/productModels';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { Document } from 'mongoose';

connect();

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        try {
            const userId = getDataFromToken(req);
            const body = await req.json();
            const { productId, amount } = body;

            // Fetch user details
            const userDoc = await User.findById(userId);
            if (!userDoc) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }

            const user = userDoc as unknown as Document & { roles: string; deposit: number };

            // Check user role
            if (user.roles !== "buyer") {
                return NextResponse.json({ message: "Not authorized" }, { status: 403 });
            }

            // Start a session to handle race conditions
            const session = await Product.startSession();
            session.startTransaction();

            try {
                // Fetch product details within session to ensure atomicity
                const product = await Product.findOne({
                    _id: productId,
                    amountAvailable: { $gte: amount } // Check stock availability atomically
                }).session(session);

                if (!product) {
                    return NextResponse.json({ message: "Product not found or insufficient stock" }, { status: 404 });
                }

                // Calculate total price
                const totalPrice = product.cost * amount;
                if (user.deposit < totalPrice) {
                    return NextResponse.json({ message: "Insufficient funds" }, { status: 400 });
                }

                // Deduct the product amount from stock atomically
                const updatedProduct = await Product.findOneAndUpdate(
                    { _id: productId, amountAvailable: { $gte: amount } },
                    {
                        $inc: {
                            amountAvailable: -amount,
                            __v: 1
                        }
                    },
                    { new: true, session }
                );

                if (!updatedProduct) {
                    throw new Error("Race condition: Stock depleted");
                }

                // Update user's deposit within the transaction
                user.deposit -= totalPrice;
                await user.save({ session });

                // Commit the transaction
                await session.commitTransaction();

                // Calculate remaining change
                let change = user.deposit;
                const coins = [100, 50, 20, 10, 5]; // Denominations in cents
                const changeArray: number[] = [];

                for (const coin of coins) {
                    while (change >= coin) {
                        changeArray.push(coin);
                        change -= coin;
                    }
                }

                return NextResponse.json({
                    totalSpent: totalPrice,
                    purchasedProducts: { productId, amount },
                    change: changeArray,
                }, { status: 200 });

            } catch (error) {
                await session.abortTransaction();
                console.error(error);
                return NextResponse.json({ message: "Race condition detected, unable to complete purchase" }, { status: 409 });
            } finally {
                session.endSession();
            }

        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: "Internal server error" }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
}
