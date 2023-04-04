const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");

//create-product path: http://127.0.0.1:3000/api/product/create-product
router.post("/create-product",userController.protect ,productController.createProduct);
//updateproduct path : {{URL}}api/product/updateproduct/642860059c2f5faff3c82a9c
router.patch("/updateproduct/:productID",userController.protect ,productController.updateProduct);
//deleteProduct path: {{URL}}api/product/deleteproduct/642860059c2f5faff3c82a9c
router.delete("/deleteproduct/:productID",userController.protect ,productController.deleteProduct);
//getAllProducts path:{{URL}}api/product/allproducts
router.get("/allproducts",userController.protect, productController.getAllProducts);
//search-product path: {{URL}}api/product/searchProduct?q=Product
router.get("/searchProduct",userController.protect, productController.searchProduct);

module.exports = router;