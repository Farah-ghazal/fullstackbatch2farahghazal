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



      //productImage: { 
       //       type: String,   // the url of the image 
       //        required: false,
       //        default:"",
        //     },


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
  exports.searchProduct = async (req, res) => {
    try {
      const query = req.query.q;
      const products = await Product.find({
        $or: [
          { productName: { $regex: query, $options: "i" } },
          { productDescription: { $regex: query, $options: "i" } },
        ],
      });
      if (products.length <= 0) {
        return res.status(404).json({ message: "No matching products found" });
      }
      return res.status(200).json(products);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  };
  
  module.exports = mongoose.model("Product", productSchema);

