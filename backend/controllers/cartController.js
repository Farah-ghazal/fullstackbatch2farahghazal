const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");


exports.addToCart = async (req,res) =>{
    try {
        //1- check if there is a cart owner 
        const cartOwner = await User.findOne({_id: req.user._id});
        if(!cartOwner){
         return res.status(404).json({message: " The Cart should have an owner"});
        }
        //Check if the product is avaialable in the database 
        const product = await Product.fineOne({_id:req.body.product});
        if(!product){ // product not found 
            return res.status(404).json({message:"Product Not Found" });
        }
        //if product is found get price and quanitity
        let productPrice = product.productPrice;
        let productQuantity = req.body.productQuantity; // user requested quantity 

        // check if the quanity is found in the database
        if(productQuantity <= product.productQuantity){
            return res.status(409).json({message:"Sorry the requested quantity is not available"});
        }
        // everthing is ok , quantity is available 
        let price = productPrice * productQuantity; // total = price of one product x number of products
        // update the qauntity of the product in the databse 
        //remaining now in db  = prevoius quantity in db - selled items 
        product.productQuantity = product.productQuantity - productQuantity;
        // save the update 
        await product.save();

        //2- check if the user already have a cart
        const cart = await User.findOne({cartOwner: cartOwner._id});
        //if he does not have a cart 
        if(!cart){
            //create a cart 
            const newCart = await Cart.create({
                cartOwner:cartOwner._id,
                products: [req.body.product],
                totalPrice:price,
            });
        return res.status(200).json({
            message:"New Cart is created",
            cart: newCart,
        });
        }
        //to add the item to the cart use push 
        cart.products.push(req.body.product);
        // add the price of the recent added product to the pervoius price list of the products that were in the cart
        cart.totalPrice = cart.totalPrice + price;
        await cart.save();
        return res.status(200).json({message :err.message})
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err.message})
    }
}