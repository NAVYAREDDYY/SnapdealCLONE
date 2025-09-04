const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL)
        console.log('connected to db')
    }
    catch (err) {
        console.log('connection failed', err.message)
    }
}

module.exports = connectDB;