
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/product"); 

dotenv.config();

const products = [
  {
    name: "Smartphone XYZ",
    description: "6.5-inch display, 128GB storage, 4GB RAM",
    price: 12999,
    category: "Mobiles",
    image: "https://via.placeholder.com/200x200?text=Smartphone+XYZ",
    stock: 50
  },
  {
    name: "Wireless Earbuds ABC",
    description: "Bluetooth 5.0, noise cancellation",
    price: 2999,
    category: "Electronics",
    image: "https://via.placeholder.com/200x200?text=Earbuds+ABC",
    stock: 100
  },
  {
    name: "Men's Casual Shirt",
    description: "Cotton, Slim fit, Blue",
    price: 799,
    category: "Clothing",
    image: "https://via.placeholder.com/200x200?text=Men+Shirt",
    stock: 200
  },
  {
    name: "Laptop Pro 15",
    description: "16GB RAM, 512GB SSD, Intel i7",
    price: 64999,
    category: "Computers",
    image: "https://via.placeholder.com/200x200?text=Laptop+Pro+15",
    stock: 20
  },
  {
    name: "Women's Handbag",
    description: "Leather, stylish and durable",
    price: 2199,
    category: "Fashion",
    image: "https://via.placeholder.com/200x200?text=Handbag",
    stock: 70
  },
  {
    name: "Smartwatch Series 5",
    description: "Fitness tracking, Heart rate monitor",
    price: 9999,
    category: "Wearables",
    image: "https://via.placeholder.com/200x200?text=Smartwatch",
    stock: 40
  },
  {
    name: "Gaming Mouse RGB",
    description: "Ergonomic, high precision, 6 buttons",
    price: 1299,
    category: "Accessories",
    image: "https://via.placeholder.com/200x200?text=Gaming+Mouse",
    stock: 150
  },
  {
    name: "Bluetooth Speaker 20W",
    description: "Portable, waterproof, deep bass",
    price: 1999,
    category: "Electronics",
    image: "https://via.placeholder.com/200x200?text=Bluetooth+Speaker",
    stock: 60
  },
  {
    name: "Men's Running Shoes",
    description: "Lightweight, comfortable, size 9",
    price: 2199,
    category: "Footwear",
    image: "https://via.placeholder.com/200x200?text=Running+Shoes",
    stock: 80
  },
  {
    name: "LED Desk Lamp",
    description: "Adjustable brightness, touch control",
    price: 799,
    category: "Home & Living",
    image: "https://via.placeholder.com/200x200?text=Desk+Lamp",
    stock: 120
  },
  {
    name: "Yoga Mat",
    description: "Non-slip, 6mm thickness, eco-friendly",
    price: 599,
    category: "Fitness",
    image: "https://via.placeholder.com/200x200?text=Yoga+Mat",
    stock: 90
  },
  {
    name: "4K Action Camera",
    description: "Waterproof, 30FPS, 64GB card included",
    price: 8999,
    category: "Electronics",
    image: "https://via.placeholder.com/200x200?text=Action+Camera",
    stock: 25
  },
  {
    name: "Backpack Travel",
    description: "30L, waterproof, multiple compartments",
    price: 1599,
    category: "Travel",
    image: "https://via.placeholder.com/200x200?text=Backpack",
    stock: 70
  },
  {
    name: "Electric Kettle 1.5L",
    description: "Stainless steel, auto shut-off",
    price: 1299,
    category: "Kitchen",
    image: "https://via.placeholder.com/200x200?text=Kettle",
    stock: 100
  },
  {
    name: "LED TV 42 inch",
    description: "Full HD, Smart TV, HDMI & USB ports",
    price: 21999,
    category: "Electronics",
    image: "https://via.placeholder.com/200x200?text=LED+TV",
    stock: 15
  }
];

// Seeder function
const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected for seeding...");

    await Product.deleteMany(); // clear old products
    console.log("Old products cleared.");

    await Product.insertMany(products);
    console.log("Products seeded successfully!");

    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding products:", err);
    mongoose.disconnect();
  }
};

seedProducts();
