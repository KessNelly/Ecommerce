const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require ("slugify");

//create new product
const createProduct = asyncHandler(async(req, res)=>{
    try{
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    }
    catch (error) {
        throw new Error(error);
    }
   
});

//update product
const updateaProduct = asyncHandler(async(req, res)=>{
    const id = req.params;
    try {
       if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
        const updateaProduct = await Product.findOneAndUpdate ({id}, req.body, {new: true});
        res.json(updateaProduct);
    } 
    catch (error) {
        throw new Error(error);
    }

});

//delete product
const deleteProduct = asyncHandler(async(req, res)=>{
    const id = req.params;
    try {
    const deleteProduct = await Product.findOneAndDelete (id);
    res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }

});


//get a product
const getaProduct = asyncHandler(async(req, res)=>{
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }

});

//get all products
const getallProduct= asyncHandler(async(req,res)=>{
    try {
        const getallProducts = await Product.find();
        res.json(getallProducts);
    } catch (error) {
        throw new Error(error);
    }

});

//filter product
// const filterProduct = asyncHandler(async(req, res)=>{
//     const{ minprice, maxprice, color, category, availability, brand} = 
//     req.params;
//     console.log(req.query);

//    try {
//     const filterProduct = await Product.find({
//         price: {
//             $gte: minprice,
//             $lte: maxprice,
//         },
//         category,
//         brand,
//         color,
//     });
//     res.json({filterProduct});
//    } catch (error) {
//     res.json(error);
//    }

//    res.json({ minprice, maxprice, color, category, availability, brand});
// });



module.exports = {createProduct, getaProduct, getallProduct, updateaProduct,deleteProduct}