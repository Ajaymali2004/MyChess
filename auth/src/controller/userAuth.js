const User = require("../models/User");
const JWT_SECRET= process.env.Secret;
const jwt =require("jsonwebtoken");
const handleSignIn = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.create({
      username: username,
      email: email,
      password: password,
    });
    const data = {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
    const auth_token =jwt.sign(data,JWT_SECRET);
    res.send({auth_token:auth_token,success:true,username:user.username});
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const handleLogin = async(req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.matchPassword(email,password); 
    const data = {
      user: {
        _id: user._id
      },
      success:true
    };
    const auth_token =jwt.sign(data,JWT_SECRET);
    res.send({auth_token:auth_token,success:true,username:user.username});
  } catch (error) {
    return res.status(400).json({ message: "Incorrect Password",success:false });
  }
};
const verify=async (req,res)=>{
  let user= await User.findById(req._id);
  
  res.status(200).json({success:true,user:user,ok:true});
}

module.exports = { handleSignIn ,handleLogin,verify};
