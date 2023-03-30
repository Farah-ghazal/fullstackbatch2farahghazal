const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
    {
    firstName:{
        type:String,
        required:[true,"Please enter your firstName"],
        minLength: 3,
        trim:true
     },
     lastName:{
        type:String,
        required:[true,"Please enter your lastName"],
        minLength: 3,
        trim:true
     },
     email:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        required:[true,"Please enter your email"]
     },
     username:{
        type:String,
        unique:true,
        trim:true,
        required:[true,"Please enter your Username"]
     },
     password:{
        type:String,
        minLength:8,
        trim:true,
        required:[true,"Please enter your Password"]
     },
     passwordConfirm:{
        type:String,
        minLength:8,
        trim:true,
        required:[true,"Please confirm your Password"]
     },
     phoneNumber:{
      type:Number,
        minLength:8,
        maxLength:8,
        trim:true,
        required:[true,"Please enter you phone number"]
     },
     role:{
        type:String,
        default:"user",
        enum:["admin","user"]// array for possible role 
     },


     orders:[
        {
          type :Schema.Types.ObjectId,
          ref:"Order",
        },  
    ],
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
},
      {  timestamps: true, } //createdAt UpdatedAt

);
 
// before to save the user hash the password then save it hashed in the database
//Automated function 
userSchema.pre("save",async function (next){
    try {
       if(!this.isModified("password")) {
        return next();
       }
       this.password = await bcrypt.hash(this.password,12);
       this.passwordConfirm= undefined;// not to save in databse
    } catch (error) {
        console.log(err);
    }
});
//Automated function to check passwords
//Candidate Password: coming from the frontend as a plaintext
//userPassword: coming from the database as a hashed value
userSchema.methods.checkPassword = async function (candidatePassword,userPassword)
{
   return await bcrypt.compare(candidatePassword,userPassword);
   //return 1 IF passwords match , 0 if not 
};

 
//Function that creates a random reset token 
userSchema.methods.generatePasswordResetToken()
{
const resetToken = crypto.randomBytes(32).toString("hex"); //will be sent via email
//saved in te database crypted 
this.passwordResetToken = crypto 
.createHash("sha256") 
.update(resetToken)
.digest("hex");

// 10 minutes of validity 
this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //millisec 
return resetToken;
};


//function that checks if the password is changed after recieving the token
userSchema.methods.passwordChangedAfterTokenIssued = function (JWTTimestamp) {
   if(this.passwordChangedAt){
      const passwordChangeTime = parseInt(
         this.passwordChangedAt.getTime()/1000,
         10
         );
         return passwordChangeTime > JWTTimestamp; // return true if password changed after the jwt token
   }
   return false;
};
module.exports = mongoose.model("User", userSchema);