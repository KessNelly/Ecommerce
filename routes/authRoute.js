const express = require ('express');
const {createUser, loginUser, getallUser, getaUser, deleteaUser, updateaUser, blockUser, unblockUser, handleRefreshToken, logOut, updatePassword} = require ('../controller/userCtrls');
const {authMiddleware, isAdmin} = require ("../middlewares/authMiddleware");
const router = express.Router();


router.post('/register', createUser);
router.put('/password',authMiddleware, updatePassword);

router.post('/login', loginUser);
router.get('/all-users', getallUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logOut);
router.get('/:id',authMiddleware, isAdmin, getaUser);
router.delete('/:id', deleteaUser);
router.put('/edit-user',authMiddleware, updateaUser);
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser);




module.exports = router;