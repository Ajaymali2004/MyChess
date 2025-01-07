const mongoose = require("mongoose");
const { randomBytes, createHmac } = require("crypto");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  salt:{
    type:String,
  },
  password: { type: String, required: true },
},{timestamps:true}
);
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
});
userSchema.static("matchPassword",async function (email,password){
  const user =await this.findOne({email});
  if(!user) throw Error("No user found");
  const salt= user.salt;
  const hashedPassword = user.password;
  const userProvidedHash = createHmac("sha256",salt).update(password).digest("hex");
  if(hashedPassword!==userProvidedHash) throw Error("Incorrect Password!");
  return user;
})
const User = mongoose.model("user", userSchema);
module.exports = User;
