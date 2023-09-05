const Brand = require ("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utils/validateMongodbid');

//create Brand
const createBrand = asyncHandler(async(req, res)=>{
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch (error) {
        throw new Error (error);
    }
});

//update Brand
const updateBrand = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {new:true});
        res.json(updatedBrand);
    } catch (error) {
        throw new Error (error);
    }
});

//delete Brand
const deleteBrand = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedBrand = await Brand.findByIdAndDelete(id);
    res.json({
        msg: "Successfully deleted!"
    });
    } catch (error) {
        throw new Error (error);
    }
});

//get a Brand
const getaBrand = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaBrand = await Brand.findById(id);
        res.json(getaBrand);
    } catch (error) {
        throw new Error (error);
    }
});

//get all Brand
const getallBrand = asyncHandler(async(req, res)=>{

    try {
        const getallBrand = await Brand.find();
        res.json(getallBrand);
    } catch (error) {
        throw new Error (error);
    }
});

//Ctrl + F to replace a word in multiple places


module.exports = {createBrand, updateBrand, deleteBrand, getaBrand, getallBrand}