const express = require('express');
const { getUser, getAllUsers, updateUser, loginUser, registerUser } = require('../app/controllers/AuthController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login',loginUser)
// router.post('/signup', signUpUser);
router.patch('/updateuserdetail/:id',updateUser)
router.get('/users/:id', getUser);
router.get('/users', getAllUsers);

module.exports = router;