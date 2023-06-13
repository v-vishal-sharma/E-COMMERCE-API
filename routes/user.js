const User = require("../models/User");
const { verifyTokenAndAuthorization } = require("./verifyToken");
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


module.exports = router;