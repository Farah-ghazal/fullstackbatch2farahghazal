const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    orderOwner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    items:[
        {
            type:Schema.Types.ObjectId,
            ref:"Product",
        },
    ],
    status:{
        type: String,
        default:"pending",
        enum:["pending","cancelled","completed"],
    },
    shippingAddress: {
        address: { type: String, required: true },
        location: {
          googleAddressId: String,
        },
    },
    
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
},
{   timestamps: true,   }
);
module.exports = mongoose.model("Order", orderSchema);