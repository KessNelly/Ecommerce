const express = require ("express"); 
const {createCoupon, getAllCoupons, updateCoupon, deleteCoupon}  = require("../controller/couponCtrls");
const {isAdmin, authMiddleware}  = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/", authMiddleware, isAdmin , createCoupon);
router.get("/",authMiddleware, isAdmin , getAllCoupons);
router.put("/:id",authMiddleware, isAdmin , updateCoupon);
router.delete("/:id",authMiddleware, isAdmin , deleteCoupon);

module.exports = router