const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");

router.post("/addtocart", userController.protect, cartController.addToCart );

module.exports =  router;