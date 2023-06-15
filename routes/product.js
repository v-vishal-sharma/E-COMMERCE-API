const Product = require("../models/Product");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

// CREATE
router.post("/", verifyTokenAndAdmin, async (req,res) => {
    const newProduct = new Product(req.body);

    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req,res) => {

    try{
        // params.id will take id from the url.
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            // take everything from the body of the request and set it again. This will not return the updated product. Writing {new:true} will fix this.
            $set: req.body
        },{new:true});

        // Send our updated product.
        res.status(200).json(updatedProduct);
    }catch(err) {
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req,res) =>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product Deleted...");
    }catch(err){
        res.status(500).json(err);
    }
});

// GET PRODUCT
// Not passing here verifyTokenAnd... because anyone can search for the product.
router.get("/find/:id", async (req,res) =>{
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err);
    }
});

// GET ALL PRODUCTS
router.get("/", async (req,res) =>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        
        let products;

        if(qNew) {
            products = await Product.find().sort({createdAt:-1}).limit(5);
        }else if(qCategory){
            products = await Product.find({
                // will add categories that the product has.
                categories: {
                    $in: [qCategory],
                },
            });
        }else{
            products = await Product.find();
        }

        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;