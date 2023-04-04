const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

exports.addToCart = async (req, res) => {
  try {
    //1- check if there is a cart owner 
    const cartOwner = await User.findOne({ _id: req.user._id });
    if (!cartOwner) {
      return res.status(404).json({ message: "The Cart should have an owner" });
    }

    //Check if the product is available in the database 
    const product = await Product.findOne({ _id: req.body.product });
    if (!product) { // product not found 
      return res.status(404).json({ message: "Product Not Found" });
    }

    //if product is found get price and quantity
    let productPrice = product.productPrice;
    let productQuantity = req.body.productQuantity; // user requested quantity 

    // check if the quantity is available in the database
    if (productQuantity > product.productQuantity) {
      return res.status(409).json({ message: "Sorry the requested quantity is not available" });
    }

    // everything is ok, quantity is available 
    let price = productPrice * productQuantity; // total = price of one product x number of products
    // update the quantity of the product in the database 
    // remaining now in db  = previous quantity in db - sold items 
    product.productQuantity = product.productQuantity - productQuantity;
    // save the update 
    await product.save();

    //2- check if the user already has a cart
    const cart = await Cart.findOne({ cartOwner: cartOwner._id });
    if (!cart) { // if user does not have a cart 
      // create a cart 
      const newCart = await Cart.create({
        cartOwner: cartOwner._id,
        products: [req.body.product],
        totalPrice: price,
      });
      // update the user's cartOwner field 
      cartOwner.cartOwner = newCart._id;
      await cartOwner.save();
      return res.status(200).json({
        message: "New Cart is created",
        cart: newCart,
        user: cartOwner,
      });
    } else { // if user has a cart 
      // add the item to the cart using push 
      cart.products.push(req.body.product);
      // add the price of the recently added product to the previous price list of the products that were in the cart
      cart.totalPrice = cart.totalPrice + price;
      await cart.save();
      return res.status(200).json({
        message: "Product added to cart",
        cart: cart,
      });
    }
  } catch (err) {
   
  }
}