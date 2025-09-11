import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  name: String,
  email: String,
  sections: Object,
  imageUrl: String,
  template: { type: String, default: 'black-white' },
  font: { type: String, default: "'Inter', sans-serif" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Portfolio", portfolioSchema);