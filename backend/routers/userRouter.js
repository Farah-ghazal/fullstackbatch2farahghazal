const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

//signup path: http://127.0.0.1:3000/api/user/signup
router.post("/signup",userController.signup);
//login path: http://127.0.0.1:3000/api/user/login
router.post("/login",userController.login);
//forgotPassword path: http://127.0.0.1:3000/api/user/forgotPassword
router.post("/forgotPassword",userController.forgotPassword);
//reset path: http://127.0.0.1:3000/api/user/reset/ydyidytdydydyiddy--this is the random token 
router.patch("/resetPassword/:token ",userController.resetPassword);
module.exports = router;
 