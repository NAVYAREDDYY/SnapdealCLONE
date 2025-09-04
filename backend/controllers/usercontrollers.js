// const User = require('../models/user')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const register = async(req,res)=>{
//       const {name,email,password}=req.body
//       try{
//       const user =await User.findOne({email})
//       if(user)
//       return res.status(400).json({message:'User already exists'})

//       const hpwd =await bcrypt.hash(password,10)  // we are hashing the pwd , with 10 salt rounds

//       const newuser = new User({name,email,password:hpwd})
//       await  newuser.save()
//       res.status(200).json({message:'Registration Succesful'})
//       }
//       catch(err){
//         res.status(500).json({message:err.message})
//       }
// }

// const login = async(req,res)=>{
//     const {email,password}=req.body
//    try{
//      const user =await User.findOne({email})
//       if(!user)
//       return res.status(400).json({message:'User Not Found'})
      
//       const IsMatch = await bcrypt.compare(password,user.password)
//        if (!IsMatch) return res.status(400).json({ message: "Invalid credentials" });
      
//        const token = jwt.sign({id:user._id}, process.env.JWTSECRET,{expiresIn: '1h'})
//        res.status(200).json({token ,user: { id: user._id, name: user.name, email: user.email }})
//    }
//     catch(err){
//         res.status(500).json({message:err.message})
//       }

// }
// module.exports={register,login}