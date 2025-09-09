const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, min: 1, max: 5 }
});   

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, 
   ratings: [ratingSchema],
  description: { type: String } , 
  category: { type: String }, 
  subcategory:{type:String},   
  stock: { type: Number },
});

module.exports = mongoose.model("Product", productSchema);
