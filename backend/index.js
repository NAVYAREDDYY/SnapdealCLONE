const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors");
const connectDB = require('./db/config')
// const authroutes = require('./routes/authroutes')
const otproutes = require('./routes/otproutes')
const productRoutes = require("./routes/productRoutes");



const app = express()
dotenv.config()
connectDB()

app.use(express.json())
app.use(cors());
// app.use('/authroutes',authroutes)
app.use('/otproutes',otproutes)
app.use("/products", productRoutes);


const PORT = process.env.PORT || 5001
app.listen(PORT,()=> console.log(`server connected on http://localhost:${PORT}`))