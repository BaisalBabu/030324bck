const express = require("express");
const router = express.Router();
const User = require("../model/user"); // Use uppercase 'User' for consistency and clarity
const userModel = require("../model/user");


router.post("/register", async (req, res) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    
    // If the email doesn't exist, proceed with user creation
    const newUser = new User(req.body); // Use uppercase 'User' here as well
    const savedUser = await newUser.save();
    res.send("User registered successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email: email, password: password }); // Fix typo in 'findOne'
    if (foundUser) {

        const temp=
        {
            name:foundUser.name,
            email:foundUser.email,
            isAdmin:foundUser.isAdmin,
            _id:foundUser._id
        }
      res.send(temp);
    } else {
      return res.status(400).json({ message: "Login Failed" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});


router.get("/getallusers" ,async(req,res)=>
{
  try {
    const users=await User.find()
    res.send(users)
  } catch (error) {
    return res.status(400).json({ error });
    
  }
})
module.exports = router;
