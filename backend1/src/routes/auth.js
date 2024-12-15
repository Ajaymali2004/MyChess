const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { handleSignIn, handleLogin, verify } = require("../controller/userAuth");
const fetchUser = require("../middleware/fetchUser");
// const fetchUser = require("../middleware/fetchUser");

router.post('/',handleSignIn);
router.post('/login',handleLogin );
router.get('/login',fetchUser,verify);
module.exports = router;