import mongoose, { Document, Schema, Model } from "mongoose";

// Define the user interface
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  roles: "seller" | "buyer";  // Restricting to seller or buyer
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  deposit:Number;
}

// Define the user schema
const userSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  deposit: {
    type: Number,
    required: true,
    default:0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  roles: {
    type: String,
    enum: ["seller", "buyer"],  // Restrict to seller or buyer
    required: true,
  },
  verifyToken: {
    type: String,
    default: null,
  },
  verifyTokenExpiry: {
    type: Date,
    default: null,
  },
});

// Check if the model is already defined to prevent overwriting
const User: Model<IUser> =
  mongoose.models.Users || mongoose.model<IUser>("Users", userSchema);

export default User;
