const express = require ("express");
const {createProduct, getaProduct, getallProduct, updateaProduct, deleteProduct} = require("../controller/productCtrls");
const {isAdmin, authMiddleware}  = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/",authMiddleware,isAdmin ,createProduct);
router.get("/:id", getaProduct);
router.put("/:id", authMiddleware,isAdmin ,updateaProduct);
router.delete("/:id", authMiddleware,isAdmin ,deleteProduct);
router.get("/", getallProduct);


module.exports = router
