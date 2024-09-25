import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  amountAvailable: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
