const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async(req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username});
        !user && res.status(401).json("Wrong Credentials!");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        originalPassword!==req.body.password && res.status(401).json("Wrong Credentials!");

        const accessToken = jwt.sign(
            {
            id:user._id,
            isAdmin: user.isAdmin
            },
            process.env.JWT_SEC,
            {expiresIn:"3d"}
        );
        // token will expire in 3days and the user will have to log in again.

        // Destructure the data and send user everything but the password. Password is filtered out here.
        // MongoDB stores all the user data in _doc variable/file, therefore, we are passing only the _doc to the user.
        const {password, ...others} = user._doc;

        // others is spread here because if not spreaded then it will create its own object with the name "others".
        res.status(200).json({...others, accessToken});
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;