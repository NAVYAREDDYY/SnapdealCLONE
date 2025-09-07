const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Product = require("../models/product"); 
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log("Mongo URL:", process.env.MONGOURL);

const products = [
  {
    name: "Smartphone XYZ",
    description: "6.5-inch display, 128GB storage, 4GB RAM",
    price: 12999,
    category: "Mobiles",
    image: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m33-1.jpg",
    stock: 50
  },
  {
    name: "Wireless Earbuds ABC",
    description: "Bluetooth 5.0, noise cancellation",
    price: 2999,
    category: "Electronics",
    image: "https://media.istockphoto.com/id/1204039347/photo/apple-airpods-on-a-white-background.jpg?s=612x612&w=0&k=20&c=2__4hfynkvBt7PA0UE7N5JxSTuaGRFVKaXJUuoQlBzk=",
    stock: 100
  },
  {
    name: "Men's Casual Shirt",
    description: "Cotton, Slim fit, Blue",
    price: 799,
    category: "Clothing",
    image: "https://m.media-amazon.com/images/I/81Kd7bcYg+L._UY350_.jpg",
    stock: 200
  },
  {
    name: "Laptop Pro 15",
    description: "16GB RAM, 512GB SSD, Intel i7",
    price: 64999,
    category: "Computers",
    image: "https://cdn.mos.cms.futurecdn.net/FUi2wwNdyFSwShZZ7LaqWf.jpg",
    stock: 20
  },
  {
    name: "Women's Handbag",
    description: "Leather, stylish and durable",
    price: 2199,
    category: "Fashion",
    image: "https://media.istockphoto.com/id/1271796113/photo/women-is-holding-handbag-near-luxury-car.jpg?s=612x612&w=0&k=20&c=-jtXLmexNgRa-eKqA1X8UJ8QYWhW7XgDiWNmzuuCHmM=",
    stock: 70
  },
  {
    name: "Smartwatch Series 5",
    description: "Fitness tracking, Heart rate monitor",
    price: 9999,
    category: "Wearables",
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSDBBZaQCol63wxqGb-ZtxHgThqlhHDfDIvQ8xkqN5ZwWTKjHttfnoxsdzY0w0NFrsn17B0GnMKxTbKAJC27c0B3VSCu--my-TqApTxFnXOOqQ0m0vqv4vK",
    stock: 40
  },
  {
    name: "Gaming Mouse RGB",
    description: "Ergonomic, high precision, 6 buttons",
    price: 1299,
    category: "Accessories",
    image: "https://m.media-amazon.com/images/I/61MJXznbAhS.jpg",
    stock: 150
  },
  {
    name: "Bluetooth Speaker 20W",
    description: "Portable, waterproof, deep bass",
    price: 1999,
    category: "Electronics",
    image: "https://m.media-amazon.com/images/I/614OpzcUKIL._UF1000,1000_QL80_.jpg",
    stock: 60
  },
  {
    name: "Men's Running Shoes",
    description: "Lightweight, comfortable, size 9",
    price: 2199,
    category: "Footwear",
    image: "https://www.tracerindia.com/cdn/shop/files/1_48c2bdf2-b834-4e09-acbd-d2072f017cdd.jpg?v=1721818441",
    stock: 80
  },
  {
    name: "LED Desk Lamp",
    description: "Adjustable brightness, touch control",
    price: 799,
    category: "Home & Living",
    image: "https://in.shop.lighting.philips.com/cdn/shop/files/Orbit_desk_light_grande.png?v=1747311743",
    stock: 120
  },
  {
    name: "Yoga Mat",
    description: "Non-slip, 6mm thickness, eco-friendly",
    price: 599,
    category: "Fitness",
    image: "https://img.freepik.com/free-photo/still-life-yoga-equipment_23-2151725313.jpg?semt=ais_incoming&w=740&q=80",
    stock: 90
  },
  {
    name: "4K Action Camera",
    description: "Waterproof, 30FPS, 64GB card included",
    price: 8999,
    category: "Electronics",
    image: "https://in.static.webuy.com/product_images/Electronics/Camcorders/SDVCSONFDRX3000C_l.jpg",
    stock: 25
  },
  {
    name: "Backpack Travel",
    description: "30L, waterproof, multiple compartments",
    price: 1599,
    category: "Travel",
    image: "https://cdn.thewirecutter.com/wp-content/media/2024/04/carryontravelbackpacks-2048px-0187.jpg",
    stock: 70
  },
  {
    name: "Electric Kettle 1.5L",
    description: "Stainless steel, auto shut-off",
    price: 1299,
    category: "Kitchen",
    image: "https://www.rasoishop.com/cdn/shop/files/8901365418849-1.jpg?v=1702895138&width=1445",
    stock: 100
  },
  {
    name: "LED TV 42 inch",
    description: "Full HD, Smart TV, HDMI & USB ports",
    price: 21999,
    category: "Electronics",
    image: "https://images.jdmagicbox.com/quickquotes/images_main/lloyd-42fs302c-led-tv-42-inch-full-hd-android-smart-tv-2021-model-2038330672-4kxdw8ul.jpg",
    stock: 15
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
