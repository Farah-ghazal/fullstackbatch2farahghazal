const mongoose= require ('mongoose');
const dotenv= require ("dotenv");
mongoose.set("strictQuery",true)
dotenv.config();

function connectDB(){

    mongoose.connect(process.env.DB_URL)
    .then(() => {
      console.log('Connected to MongoDB Atlas successfully!');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB Atlas:', error);
    });

};

module.exports = {connectDB};