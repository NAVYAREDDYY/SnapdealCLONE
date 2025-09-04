const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors");
const connectDB = require('./db/config')
const authroutes = require('./routes/authroutes')
const otproutes = require('./routes/otproutes')

const app = express()
dotenv.config()
connectDB()

app.use(express.json())
app.use(cors());
app.use('/authroutes',authroutes)
app.use('/otproutes',otproutes)


const PORT = process.env.PORT || 5001
app.listen(PORT,()=> console.log(`server connected on http://localhost:${PORT}`))