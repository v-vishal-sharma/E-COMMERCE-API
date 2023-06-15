const Cart = require("../models/Cart");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const router = require("express").Router();

// CREATE
router.post("/", verifyToken, async (req,res) => {
    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req,res) => {

    try{
        // params.id will take id from the url.
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            // take everything from the body of the request and set it again. This will not return the updated Cart. Writing {new:true} will fix this.
            $set: req.body
        },{new:true});

        // Send our updated Cart.
        res.status(200).json(updatedCart);
    }catch(err) {
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req,res) =>{
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart Item Deleted...");
    }catch(err){
        res.status(500).json(err);
    }
});

// GET USER CART
router.get("/find/:id", verifyTokenAndAuthorization, async (req,res) =>{
    try{
        const cart = await Cart.findOne(req.params.id);
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL
// fetches all carts therefore this is only for the admin.
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;