const User = require("../models/userModel");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {promisify} = require("util"); // convert ffrom callback function to promise

const signToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIN: process.env.JWT_EXPIRES_IN,  
    });
};


const createSendToken = (user,statusCode,res) =>{
    const token = signToken(user._id);
    res.status(statusCode).json({
        status:"success",
        token,
        data:{
            user,
        },
    });
};


exports.signUp = async(req,res) => {
    try {
        const emailCheck = await User.findOne({email : req.body.email});
        if(emailCheck){
            // 1 Check if the email is in use
            return res.status(409).json({message:"The email is already in use"});
        }

        if(!validator.isEmail(req.body.email)){
            // 2 Check if the email is valid
            return res.status(400).json({message:"The email is already not valid"});
        }
        if(req.body.password !==req.body.passwordConfirm){
              // 3 Check if the passwords match
            return res.status(400).json({message:"The passwords do not match"});
        }
        //everything OK create a new user
        

        const newUser = await User.create({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            username:req.body.username,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            role:req.body.role,
        });

            //return res.status(201).json({
            //message:"User created successfully",   data:{ newUser, },  });
            createSendToken(newUser,201,res)

    } catch (err) {
        res.status(500).json({message: err.message});
        console.log(err);
    }
}


exports.login = async(req,res) =>{
    try {
        // 1: Check if the user email exists in the database
        const user = await User.findOne({email:req.body.email}); 
        if(!user){
            return res.status(404).json({message:"THe user does not exists"});
        }
        // 2:Check if the entered password matches the hashed password in the database
        // call the function checkpasswords
        if(!(await user.checkPassword(req.body.password,user.password))){
            return res.status(400).json({message:"Incorrect Credentials "});
        }
        // 3:If everything is OK log the user in
     //return res.status(200).json({message:"You are logged in successfully"});
     createSendToken(newUser,200,res)
    } catch (error) {
        console.log(err.message);
    }
}

exports.forgotPassword = async(req,res) =>{
    try {
        // 1-Check if the user with the provided email exists
        const user = await User.findOne({email: req.body.email})
        if(!user){
            return res.json({message:"The user with the provided email does not exist"});
        }
        // 2-Create the reset token tobe sent via email
        const resetToken = user.generatePasswordResetToken();
        await user.save({validateBeforeSave: false });
        // 3-send the token via email
        // http://127.0.0.1:3000/api/auth/resetPassword/sddhflliauhdfuaerinjkddbvkabvju
        // 3-1 create this url 
        const url = `${req.protocol}://${req.get("host")}/api/auth/resetPassword/${resetToken}}`;
        //3-2 message created 
        const msg = `Forgot your password? Reset it by visiting the following link${url}`;
    
    
    } catch (err) {
        console.log(err); 
    }
}

exports.resetPassword = async (req,res) =>{
    try {
        const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

        const user = await User.findOne({
            passwordResetToken : hashedToken,
            passwordResetExpires:{$gt: Date.now()},
        });

        if(!user){
            return res.status(400).json({message:"The token is invalid or expired. PLease request a new one",
        });
        }

        if(req.body.password !== req.body.passwordConfirm){
            return res
            .status(400)
            .json({  message:"Password And Password Confirm are not the same "});
        }

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.passwordChangedAt = Date.now();
        
        await user.save();
        return res.status(200).json({message:"Password changed successfully"});
    } catch (err) {
        console.log(err.message);
    }
}

exports.protect = async(req,res,next) =>{
    try{
        //1-we should check if the user is logged in or sign in 
        // this means we want to check if a token exists
        let token; // define an empty token 
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
        ){
        token = req.headers.authorization.split(" ")[1];
    }
    if(!token){
    return res.status(401).json({message:"You are not logged in"});
    }
    //2-token verification
    let decoded;
    try{
        decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);// decode the token 
    }catch(error){
     if(error.name==="JsonWebTokenError"){
        return res.status(401).json("Invalid token");
     }else if (error.name === "TokenExpiredError"){
        return res.status(401).json("Your session token has expired. Try to Login again ");
     }
    }
    //3- check the user is still exist  maybe the user is  deleted but the token is still surviving 
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return res.status(401).json("The token owner no longer exists");
    }
    // 4- check if the user changed the password after recieving the token
    //  iat  initialization date of the token 
    if(currentUser.passwordChangedAfterTokenIssued(detected.iat)){
        return res.status(401).json({message:"Your password has been changed, please log in again."});
    }
    //we add the user to all the requests
    req.user = currentUser;
    next();
    }catch(err){
        console.log(err.message);
    };
}