const express = require("express");
const app = express();
const DB = require("./database").connectDB;
//Routes
const userRouter = require("./routers/userRouter")
const cardRouter = require("./routers/cartRouter");
const orderRouter = require("./routers/orderRouter")
const productRouter = require("./routers/productRouter")
//signup path: http://localhost:3000/api/auth/signup

//connect to the database
DB();
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/cart", cardRouter);
app.use("/api/order", orderRouter);
app.use("/api/product", productRouter);




app.listen(process.env.PORT, () => {
    console.log(`listening on port:${process.env.PORT}`);
});