const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
    {
      reviewName: { type: String, required: true },
      reviewComment: { type: String, required: true },
      reviewRating: { type: Number, required: true },
    },
    {
      timestamps: true,
    }
  );
  
  const productSchema = new mongoose.Schema(
    {
      productName: { 
        type: String,
        required: [true,"Add the product name"],
        unique: true,
        trim:true,
        minlength:3,
                   },
      productDescription: {
        type: String,
        required: [true,"Add the product Description"],
        trim: true,
        minLength:3,
        maxLength:255,
                   },



      productImage: { 
              type: String,   // the url of the image 
               required: true,
               default:"",
             },


      productPrice: { 
               type: Schema.Types.Decimal128,
               default: "00",
               required:  [true,"Add the product Price"],
             },

      productQuantity: { 
                    type: Number,
                    required: [true,"Add the product quantity"],
                    default: "0", 
                },
      createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
      },     

      rating: { type: Number,
               required: true
              },

      numReviews: { type: Number,
                required: true
            },

      reviews: [reviewSchema],
    },

    {
      timestamps: true,
    }
  );
  module.exports = mongoose.model("Product", productSchema);

