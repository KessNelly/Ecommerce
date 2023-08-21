const User = require ('../models/userModel');
const asyncHandler = require("express-async-handler");
const {generateToken} = require("../config/jwtToken")

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

   //Login a user
   const loginUser = asyncHandler(async (req,res)=>{
       const {email, password} = req.body
       //check if user exists
       const findUser = await User.findOne({email});
       if(findUser && await findUser.isPasswordMatched(password)){
          res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token:generateToken(findUser?._id),

          })
       }else{
         throw new Error("Invalid Credentials")
       }
   })

   //update a user
   const updateaUser = asyncHandler(async (req,res)=>{
      const {id} = req.params;
      try{
       const updateUser = await User.findByIdAndUpdate(id, {
         firstname: req?.body?.firstname,
         lastname: req?.body?.lastname,
         email: req?.body?.email,
         mobile: req?.body?.mobile,
       },
       {
         new: true,
       });
       res.json(updateUser)
      }catch (error) {
         throw new Error (error)
      }
   })

   //get all users
   const getallUser = asyncHandler(async (req, res)=>{
      try {
         const getUsers = await User.find();
         res.json(getUsers);
      } catch (error) {
         throw new Error (error);
      }
   })

   //get a single user
   const getaUser = asyncHandler(async (req,res)=>{
      const {id} = req.params;
      try {
         const getUser = await User.findById(id);
         res.json(getUser);
      } catch (error) {
         throw new Error (error)
      }

   });

   //delete a user
   const deleteaUser = asyncHandler(async (req,res)=>{
      const {id} = req.params;
      try {
         const deleteaUser = await User.findByIdAndDelete(id);
         res.json(deleteaUser);
      } catch (error) {
         throw new Error (error)
      }

   });

   

module.exports = {createUser, loginUser, getallUser, getaUser, deleteaUser, updateaUser};
