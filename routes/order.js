const Order = require("../models/Order");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const router = require("express").Router();

// CREATE
router.post("/", verifyToken, async (req,res) => {
    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req,res) => {

    try{
        // params.id will take id from the url.
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            // take everything from the body of the request and set it again. This will not return the updated Order. Writing {new:true} will fix this.
            $set: req.body
        },{new:true});

        // Send our updated Order.
        res.status(200).json(updatedOrder);
    }catch(err) {
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req,res) =>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order Deleted...");
    }catch(err){
        res.status(500).json(err);
    }
});

// GET USER ORDERS
router.get("/find/:id", verifyTokenAndAuthorization, async (req,res) =>{
    try{
        const orders = await Order.find(req.params.id);
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL ORDERS
// fetches all orders therefore this is only for the admin.
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req,res) => {
    
});


module.exports = router;