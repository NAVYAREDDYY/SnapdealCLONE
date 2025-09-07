const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, // optional, for discount
  rating: { type: Number }, // optional
  description: { type: String } , // optional
  category: { type: String },     
  stock: { type: Number },
  isAdmin :{ type: Boolean, default: false },

});

module.exports = mongoose.model("Product", productSchema);
