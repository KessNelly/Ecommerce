const User = require ('../models/userModel');
const asyncHandler = require("express-async-handler")

//Create new User
const createUser = asyncHandler(
   async (req, res)=>{
      const email = req.body.email;
      const findUser = await User.findOne({email: email});
      if(!findUser){
         // create new user
         const newUser = await User.create(req.body)
         res.json(newUser);
      }
      else{
         // user already exists
         // res.json({
         //  msg:'User already exists',
         //  success: false
         // })
         throw new Error('user already exists')
      }
   })

module.exports = {createUser};