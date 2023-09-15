const express = require ("express");
const {createProduct, getaProduct, getallProduct, updateaProduct, deleteProduct, addToWishList, rating, uploadImages} = require("../controller/productCtrls");
const {isAdmin, authMiddleware}  = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadimages");
const router = express.Router();


router.post("/",authMiddleware,isAdmin ,createProduct);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages);
router.get("/:id", getaProduct);
router.put("/wishlist", authMiddleware,addToWishList);
router.put("/rating", authMiddleware,rating);
router.put("/:id", authMiddleware,isAdmin ,updateaProduct);
router.delete("/:id", authMiddleware,isAdmin ,deleteProduct);
router.get("/", getallProduct);


module.exports = router
