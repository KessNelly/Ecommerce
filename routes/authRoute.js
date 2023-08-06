const express = require ('express');
const {createUser} = require ('../controller/userCtrls');
const router = express.Router();

router.post('/register', createUser);



module.exports = router;