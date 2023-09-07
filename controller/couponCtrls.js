const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utils/validateMongodbid');

//create coupon
const createCoupon = asyncHandler(async (req, res)=>{
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error (error);
    }
});

//get all coupons
const getAllCoupons = asyncHandler(async (req, res)=>{
    try {
        const coupon = await Coupon.find();
        res.json(coupon);
    } catch (error) {
        throw new Error (error);
    }
});

//update coupon
const updateCoupon = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updatedcoupon = await Coupon.findByIdAndUpdate(id, req.body, {new:true});
        res.json(updatedcoupon);
    } catch (error) {
        throw new Error (error);
    }
});

//delete coupon
const deleteCoupon = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedcoupon = await Coupon.findByIdAndDelete(id);
        res.json({
           msg : "Deleted successfully"
        });
    } catch (error) {
        throw new Error (error);
    }
});


module.exports = {createCoupon, getAllCoupons, updateCoupon, deleteCoupon};