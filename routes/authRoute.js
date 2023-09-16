const express = require ('express');
const {createUser, loginUser, getallUser, getaUser, deleteaUser, updateaUser, blockUser, unblockUser, handleRefreshToken, logOut, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart} = require ('../controller/userCtrls');
const {authMiddleware, isAdmin} = require ("../middlewares/authMiddleware");
const router = express.Router();


router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.put('/password',authMiddleware, updatePassword);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);
router.post('/cart', userCart);

router.get('/all-users', getallUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logOut);
router.get('/wishlist',authMiddleware,  getWishlist);
router.get('/cart',authMiddleware,  getUserCart);

router.get('/:id',authMiddleware, isAdmin, getaUser);
router.delete('/empty-cart', authMiddleware, emptyCart);

router.delete('/:id', deleteaUser);
router.put('/edit-user',authMiddleware, updateaUser);
router.put('/save-address',authMiddleware, saveAddress);

router.put('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser);




module.exports = router;