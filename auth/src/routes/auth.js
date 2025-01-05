const express = require("express");
const router = express.Router();
// const User = require("../models/User");
const { handleSignIn, handleLogin, verify } = require("../controller/userAuth");
const fetchUser = require("../middleware/fetchUser");
const { verifyUser } = require("../controller/verifyUser");

router.post('/signin',handleSignIn);
router.post('/login',handleLogin );
router.get('/login',fetchUser,verify);
router.post('/verifyUser',verifyUser);
module.exports = router;