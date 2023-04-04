const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");

exports.createNewOrder = async (req,res) => {
    try{
        // 1 Check if the user has a cart
        const cart = await User.findOne({_id: req.body.cartID});
        if(!cart){
           return res.status(404).json({ message : "Cart not found."})
        }

        // 2 get the Cart Owner
        const cartOwner = await User.findOne({_id: req.user.cartOwner});
        if(!cartOwner){
            return res.status(404).json({ message : "CartOwner is not found."})
         }
         // if cartOwner is found 
         //create new order 
         const newOrder = new Order ({
            orderOwner:cartOwner._id,
            items: cart.products,
            status:"pending",
            shippingAddress: req.body.shippingAddress,
            isPaid: false ,
            paidAt: "",
            isDelivered: false,
            deliveredAt:"",
        });
        //save the new order
        await newOrder.save();
        // after sending the order empty the cart
        cart.products=[];
        await cart.save();
        res.status(200).json({message:"Order Created"});
    
    }catch(err){
    console.log(err);
    res.status(500).json({message :err.message});
    }
}
// cancel an order
exports.cancelOrder = async (req, res) => {
    try {
        // Check if the order exists
        const order = await Order.findOne({_id: req.params.orderId});
        if (!order) {
            return res.status(404).json({ message : "Order not found."})
        }

        // Check if the user is authorized to cancel the order
        if (req.user._id.toString() !== order.orderOwner.toString()) {
            return res.status(401).json({ message: "You are not authorized to cancel this order."});
        }

        // Update the order status to cancelled
        order.status = "cancelled";
        await order.save();

        res.status(200).json({message: "Order cancelled."});
    } catch(err) {
        console.log(err);
        res.status(500).json({message: err.message});
    }
}