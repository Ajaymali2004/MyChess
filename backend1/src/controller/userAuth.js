const User = require("../models/User");
const JWT_SECRET="ajayMali";
const jwt =require("jsonwebtoken");
const handleSignIn = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = await User.create({
      username: username,
      email: email,
      password: password,
    });
    const data = {
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
      },
    };
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const handleLogin = async(req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't Exist" });
    }
    if(password!==user.password){
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const data = {
      user: {
        _id: user._id
      },
      success:true
    };
    const auth_token =jwt.sign(data,JWT_SECRET);
    res.send({auth_token:auth_token,success:true,name:user.username});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const verify=async (req,res)=>{
  let user= await User.findById(req._id);
  res.status(200).json({success:true,user:user});
}

module.exports = { handleSignIn ,handleLogin,verify};
