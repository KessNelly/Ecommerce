const express = require ('express');
const {createUser, loginUser, getallUser, getaUser, deleteaUser, updateaUser} = require ('../controller/userCtrls');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/all-users', getallUser);
router.get('/:id', getaUser);
router.delete('/:id', deleteaUser);
router.put('/:id', updateaUser);



module.exports = router;