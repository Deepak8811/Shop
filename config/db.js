import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn =await mongoose.connect(process.env.MONGO_URL);
    console.log("mongoDB connected: ", conn.connection.host.cyan.underline);
  } catch (error) {
    console.log("mongoDB error: ", error.message.red.underline.bold);
    process.exit();
  }
};

export default connectDB;
