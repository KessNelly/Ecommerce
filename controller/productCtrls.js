const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require ("slugify");
const validateMongoDbId = require('../utils/validateMongodbid');

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
   const {id} = req.params;
    try {
       if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
        const updateaProduct = await Product.findByIdAndUpdate (id, req.body, {new: true});
        res.json(updateaProduct);
    } 
    catch (error) {
        throw new Error(error);
    }

});

//delete product
const deleteProduct = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    try {
    const deleteProduct = await Product.findByIdAndDelete (id);
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
        // const getallProducts = await Product.find();
        // res.json(getallProducts);

     //Filtering
    const queryObj = { ...req.query};
    const excludeFields = ["page", "sort", "limit","fields"];
    excludeFields.forEach((el)=> delete queryObj[el]);
    console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=> `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    //Sorting

    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");
    }

    //Limiting the fields

    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
    } else {
        query = query.select("-__v");
    }

    //Pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if(req.query.page) {
        const productCount = await Product.countDocuments();
        if (skip >= productCount) throw new Error("This Page does not Exist");
    }
    console.log(page, limit, skip);

    const product = await query;
    res.json(product);
    } catch (error) {
        throw new Error(error);
    }

});

//create wishlist
const addToWishList = asyncHandler(async (req, res) =>{
    const { _id} = req.user;
    const { prodId} = req.body;
try{
    const user = await User.findById(_id)
    
    //check if product is already added
    const alreadyAdded = user.wishlist.find((id)=> id.toString() === prodId);
    if (alreadyAdded) {
        //pull ie remove
        let user = await User.findByIdAndUpdate(
             _id,
             {
                $pull: { wishlist: prodId}
             },
             {
                new: true,
             }
             );
             res.json(user)
    } else {
        // push ie add
        let user = await User.findByIdAndUpdate(
            _id,
            {
               $push: { wishlist: prodId}
            },
            {
               new: true,
            }
            );
            res.json(user)

    }
} catch (error) {
    throw new Error (error);
}
});

const rating = asyncHandler(async (req, res)=>{

    // for this, we need 3 things- id, star and prodId
    const { _id} = req.user;
    const { star, prodId, comment} = req.body;
    try {
        const product = await Product.findById(prodId); //find the product with the id

        //find if product is already rated
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString()=== _id.toString()
            );
            if (alreadyRated) {
                const updateRating = await Product.updateOne(
                    {
                        ratings: { $elemMatch: alreadyRated},
                    },
                    {
                        $set: { "ratings.$.star": star, "ratings.$.comment": comment},
                    },
                    {
                        new:true,
                    }
                );
               // res.json (updateRating);
            } else {
                const rateProduct = await Product.findByIdAndUpdate(prodId, {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true,
                });
                //res.json(rateProduct)

            }
          //get total rating
            const getallratings = await Product.findById(prodId);
            let totalRating = getallratings.ratings.length;
            let ratingsum = getallratings.ratings
            .map((item)=> item.star)
            .reduce((prev,curr)=> prev + curr, 0);
            let actualRating = Math.round(ratingsum / totalRating);
            let finalproduct = await Product.findByIdAndUpdate(prodId, {
                totalrating: actualRating,
            },
            {
                new:true,
            });
            res.json(finalproduct);
    } catch (error) {
        throw new Error (error);
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



module.exports = {createProduct, getaProduct, getallProduct, updateaProduct,deleteProduct, addToWishList, rating}