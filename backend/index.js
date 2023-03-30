const express = require("express");
const app = express();
const DB = require("./database").connectDB;
//Routes
const authRouter = require("./routers/authRoutes")
//signup path: http://localhost:3000/api/auth/signup

//connect to the database
DB();
app.use(express.json());
app.use("/api/auth",authRouter);
app.listen(process.env.PORT,()=>{
    console.log(`listening on port:${process.env.PORT}`);
});