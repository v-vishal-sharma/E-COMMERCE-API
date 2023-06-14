const User = require("../models/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req,res) => {
    // Encrypting the new password in case the user changes the password.
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }

    try{
        // params.id will take id from the url.
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            // take everything from the body of the request and set it again. This will not return the updated user. Writing {new:true} will fix this.
            $set: req.body
        },{new:true});

        // Send our updated user.
        res.status(200).json(updatedUser);
    }catch(err) {
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req,res) =>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User Deleted...");
    }catch(err){
        res.status(500).json(err);
    }
});

// GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req,res) =>{
    try{
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req,res) =>{
    // This will check for any queries in our request. Queries -> url?query=any. Here "new" will be searched in queries.
    const query = req.query.new;
    try{
        // this will check for query. If query is found then it will sort the users from new to old using "sort({_id:-1})" and "limit()" sets how many users will be returned.
        const users = query
        ?await User.find().sort({_id:-1}).limit(1)
        :await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));

    try{
        //get all the createdAt time stamps of the users. $gte will do the comparison of greater than.
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
                // get the month number from created at timestamp and assign it to month variable.
                $project: {
                    month: {$month: "$createdAt"},
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum:1},
                }
            }
        ]);

        res.status(200).json(data);

    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;