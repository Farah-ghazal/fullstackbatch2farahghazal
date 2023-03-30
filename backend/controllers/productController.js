const Product = require("../models/productModel");
const User = require("../models/userModel");
// normal local function because we dont need it outside the product controller 
// function check admin
const checkAdmin = async (req) =>{
    try{
        const user = await User.findOne({_id: req.user._id});

        if(!user || user.role !== "admin"){
            return false;
        }else{
            return true;
        }
    }catch(err){
    console.log(err);
    }
};

exports.createProduct = async(req,res) =>{
    try{
        const user = await checkAdmin(req);
        if(user === false) // not admin
        {
            return res.status(404).json({message:"A Product should be added only by An Admin."});
        }
        //user === true 
        const newReview = {
            reviewName: req.body.reviewName,
            reviewComment: req.body.reviewComment,
            reviewRating: req.body.reviewRating,
          };

        const newProduct = await Product.create({
            productName:req.body.productName,
            productDescription:req.body.productDescription,
           // productImage:req.body.productImage,
            productPrice:req.body.productPrice,
            productQuantity:req.body.productQuantity,
            createdBy:req.user._id,
            rating:req.body.rating,
            numReviews:req.body.numReviews,
            reviews:[newReview],
        });
        res.status(201).json({
            message:"Product added succesfully ",
            product: newProduct,
        });
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    };
}

exports.updateProduct = async(req,res) =>{
    try{
        const user = await checkAdmin(req);
        if(user === false) // not admin
        {
            return res.status(404).json({message:"A Product should be updated only by An Admin."});
        }
         const product = await Product.findByIdAndUpdate(
            req.params.productID,
            req.body,
            { new : true }
         );
         if(!product){
            return res.status(404).json({message:"Product Not Found"});
         }
         return res.status(404).json({message:"Product updated successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
};

exports.deleteProduct = async (req,res) => {
    try {
        const user = await checkAdmin(req);
        if(user === false) // not admin
        {
            return res.status(404).json({message:"A Product can be deleted only by An Admin."});
        }
         const product = await Product.findByIdAndDelete(req.params.productID);
         if(!product){
            return res.status(404).json({message:"Product Not Found"});
         }
         return res.status(404).json({message:"Product has been deleted"});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getAllProducts = async (req,res) => {
    try {
         const products = await Product.find();
         if(products.length <= 0){
            return res.status(404).json({message:" NO Products are available"})
         }
         return res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.FindProduct = async (req,res) => {
    try {
         const product = await Product.findById(req.params.productID)
         if(!product){
            return res.status(404).json({message:" Product not found"});
         }
         return res.status(200).json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

