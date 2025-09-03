const express = require('express')
const dotenv = require('dotenv')
// const cors = require("cors");
const connectDB = require('./db/config')
const authroutes = require('./routes/authroutes')
dotenv.config()
connectDB()

app.use(express.json())
app.use('authrotes',authroutes)
const app = express()


const PORT = process.env.PORT || 5001
app.listen(PORT,()=> console.log(`server connected on http://localhost:${PORT}`))