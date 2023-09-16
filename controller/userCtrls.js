const User = require ('../models/userModel');
const Product = require ('../models/productModel');
const Cart = require ('../models/cartModel');

const asyncHandler = require("express-async-handler");
const {generateToken} = require("../config/jwtToken");
const validateMongoDbId = require('../utils/validateMongodbid');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require("jsonwebtoken");
const sendEmail = require('./emailCtrls');
const crypto = require("crypto");

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
         const refreshToken = await generateRefreshToken(findUser?._id);
         const updateuser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
         },
          {new:true}
          );
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
          });
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
   });


   //Admin login
   const loginAdmin = asyncHandler(async (req,res)=>{
      const {email, password} = req.body
      //check if user exists
      const findAdmin = await User.findOne({email});
      if (findAdmin.role !== "admin") throw new Error("Not Authorized")
      if(findAdmin && await findAdmin.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(findAdmin.id, {
           refreshToken: refreshToken,
        },
         {new:true}
         );
         res.cookie("refreshToken", refreshToken, {
           httpOnly: true,
           maxAge: 72 * 60 * 60 * 1000,
         });
         res.json({
           _id: findAdmin?._id,
           firstname: findAdmin?.firstname,
           lastname: findAdmin?.lastname,
           email: findAdmin?.email,
           mobile: findAdmin?.mobile,
           token:generateToken(findAdmin?._id),

         })
      }else{
        throw new Error("Invalid Credentials")
      }
  })


   //handle refresh token
   const handleRefreshToken = asyncHandler(async ( req,res)=>{
      const cookie = req.cookies;
      if (!cookie?.refreshToken) throw new Error("No Refresh Token In Cookies");
      const refreshToken = cookie.refreshToken;
      const user = await User.findOne({refreshToken});
      if (!user) throw new Error("No Refresh token present in db or not matched")
      jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded)=>{
        if (err || user.id !== decoded.id) {
         throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id)
        res.json({accessToken})
      });
   });

   //logout functionality
   const logOut = asyncHandler(async (req, res)=>{
      const cookie = req.cookies;
      if (!cookie?.refreshToken) throw new Error("No Refresh Token In Cookies");
      const refreshToken = cookie.refreshToken;
      const user = await User.findOne({refreshToken});
      if (!user) {
         res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
         });
         return res.sendStatus(204); //forbidden
      }
      await User.findOneAndUpdate({refreshToken,
         refreshToken: "",
      });
      res.clearCookie("refreshToken", {
         httpOnly: true,
         secure: true,
      });
      return res.sendStatus(204); //forbidden
   });

   //update a user
   const updateaUser = asyncHandler(async (req,res)=>{
      //const {id} = req.params;
      const {_id} = req.user;
      validateMongoDbId(_id);
      try{
       const updateUser = await User.findByIdAndUpdate(
         _id, 
         {
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

   //save user Address
   const saveAddress = asyncHandler(async (req, res, next)=>{
      const {_id} = req.user;
      validateMongoDbId(_id);
      try{
         const updateUser = await User.findByIdAndUpdate(
           _id, 
           {
           address: req?.body?.address,
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
      validateMongoDbId(id);
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

   //block a user
   const blockUser = asyncHandler(async (req, res)=>{
      const { id } = req.params;
      validateMongoDbId(id)
      try {
         const block = await User.findByIdAndUpdate(
            id,
            {
               isBlocked: true,
            },
            {
               new:true,
            }
         );
         res.json({
            message: "User Blocked",
         })
      } catch (error) {
         throw new Error(error);
      }
   });

   //unblock a user
   const unblockUser = asyncHandler(async (req, res)=>{
      const { id } = req.params;
      validateMongoDbId(id)
      try {
         const unblock = await User.findByIdAndUpdate(
            id,
            {
               isBlocked: false,
            },
            {
               new:true,
            }
         );
         res.json({
            message: "User UnBlocked",
         })
      } catch (error) {
         throw new Error(error);
      }
   });

   //update password
   const updatePassword = asyncHandler(async(req,res)=>{
      const {_id} = req.user;
      const {password} = req.body;
      validateMongoDbId(_id);
      const user = await User.findById(_id);
      if (password) {
         user.password = password;
         const updatedPassword = await user.save();
         res.json(updatedPassword);
      } else {
         res.json(user);
      }
   });
   
   //forgot password
   const forgotPasswordToken = asyncHandler(async(req, res)=>{
      const {email} = req.body;
      const user = await User.findOne({ email});
      if (!user) throw new Error("User not found with this email");
      try{
         // create token
         const token = await user.createPasswordResetToken();
         await user.save();
         const resetURL = `Hi, Please follow this link to reset your password. This link is valid for 10minutes.<a href= 'http://localhost:3010/api/user/reset-password/${token}'>Click here</>`;
         //create data object
         const data = {
            to: email,
            subject: "Forgot Password Link",
            text: "Hey User",
            htm: resetURL,
         };
         sendEmail(data);
         res.json(token);
      }
      catch (error) {
         throw new Error (error);
      }
   });

   //reset pasword
   const resetPassword = asyncHandler(async(req, res)=>{
      const {password} = req.body;
      const {token} = req.params;
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
      const user = await User.findOne({
         passwordResetToken: hashedToken,
         passwordResetExpires: {$gt: Date.now()},
      });
      if(!user) throw new Error("Token expired, please try again later");
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      res.json(user);
   });

   //wishlist
   const getWishlist = asyncHandler(async (req, res)=>{
      //get user
      const { _id } = req.user;
      try {
         //find user
         const findUser = await User.findById(_id).populate("wishlist");
         res.json(findUser);
      } catch (error) {
         throw new Error (error)
      }
   });


   //user cart
   const userCart = asyncHandler(async (req, res)=>{
      const { cart } = req.body;
      const { _id } = req.user;
      validateMongoDbId(_id);
      try {
         let products = [];
         const user = await User.findById(_id);
         //check if user already has products in cart
         const alreadyExistCart = await Cart.findOne({ orderby: user._id});
         if (alreadyExistCart) {
            alreadyExistCart.remove();
         }
         for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
         }
         let cartTotal = 0;
         for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
           }
         let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
         }).save();
         res.json(newCart)
      } catch (error) {
         throw new Error (error)
      }
   });   

   //get user cart
   const getUserCart = asyncHandler(async (req,res)=>{
      const { _id } = req.user;
      validateMongoDbId(_id);
      try {
         const cart = await cart.findOne({ orderby: _id}).populate("products.product");
         res.json(cart);
      } catch (error) {
         throw new Error (error)
      }

   });

   //empty cart
   const emptyCart = asyncHandler(async (req, res)=>{
      const { _id } = req.user;
      validateMongoDbId(_id);
      try {
         const user = await User.findOne({_id});
         const cart = await Cart.findOneAndRemove({ orderby: user._id});
         res.json(cart);
      } catch (error) {
         throw new Error (error)
      }
   });


module.exports = {createUser, loginUser, getallUser, getaUser, deleteaUser, updateaUser, blockUser, unblockUser,  handleRefreshToken, logOut, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart};
