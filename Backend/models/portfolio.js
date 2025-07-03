import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  name: String,
  email: String,
  sections: Object,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Portfolio", portfolioSchema);
