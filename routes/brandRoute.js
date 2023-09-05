const express = require("express");
const { createBrand, updateBrand, deleteBrand, getaBrand, getallBrand} =require("../controller/brandCtrls");
const { authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/:id", getaBrand);
router.get("/", getallBrand);


module.exports = router;