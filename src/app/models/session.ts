import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1d' }, 
});

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
