const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Product = require("../models/product"); 
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log("Mongo URL:", process.env.MONGOURL);

const products = [
  {
    name: "Men's T-Shirt",
    description: "Cotton, Slim fit, Blue",
    price: 799,
    category: "Men's Fashion",
    subcategory: "T-Shirts",
    image: "https://m.media-amazon.com/images/I/81Kd7bcYg+L._UY350_.jpg",
    stock: 200
  },
  {
    name: "Women's Kurti Set",
    description: "Cotton, Printed, Pink",
    price: 999,
    category: "Women's Fashion",
    subcategory: "Kurtis & Suits",
    image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTp3a0iRh5gWXYdJ6Fth3dm0qycGV8EI-xsmB0N38FTrtPQuGdBD61zVfcuekYTIoy5EbP1nICtfvMn12th1ywf7LQ22LQYkemcMaR-Xsgh",
    stock: 150
  },
  {
    name: "Kitchen Tools Set",
    description: "Stainless steel, 5 pieces",
    price: 499,
    category: "Home & Kitchen",
    subcategory: "Kitchen Tools",
    image: "https://m.media-amazon.com/images/I/71Q1Iu4suSL._SX679_.jpg",
    stock: 100
  },
  {
    name: "Kids Toy Car",
    description: "Battery operated, Red",
    price: 1299,
    category: "Toys, Kids' Fashion",
    subcategory: "Toys",
    image: "https://m.media-amazon.com/images/I/61QK6p9QKGL._SX679_.jpg",
    stock: 80
  },
  {
    name: "Herbal Face Cream",
    description: "Aloe vera, 100g",
    price: 299,
    category: "Beauty, Health",
    subcategory: "Skin Care",
    image: "https://m.media-amazon.com/images/I/61QK6p9QKGL._SX679_.jpg",
    stock: 120
  }
];


const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected for seeding...");

    for (let prod of products) {
      await Product.updateOne(
        { name: prod.name }, 
        { $set: prod },      
        { upsert: true }  
      );
      console.log(`Product processed: ${prod.name}`);
    }

    console.log("All products updated/inserted successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding products:", err);
    mongoose.disconnect();
  }
};



seedProducts();
