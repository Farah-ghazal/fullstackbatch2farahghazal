const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");

router.post("/new-order", userController.protect, orderController.createNewOrder);
router.patch("/cancel-order/:orderId",userController.protect ,productController.cancelOrder);
module.exports =  router;

