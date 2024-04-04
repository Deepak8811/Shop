import mongoose from "mongoose";
import dotenv from "dotenv";
import mongoDB from "./config/db.js";
import colors from "colors";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import users from "./data/user.js";
import products from "./data/products.js";

dotenv.config();
mongoDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createUsers = await User.insertMany(users);
    const adminUser = await createUsers[0]._id;
    // const sampleProducts = products.map((product) => {
    //   return { ...products, user: adminUser };
    // });
    await Product.insertMany(products);
    console.log("data imported".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error.message.red.inverse);
    process.exit();
  }
};
const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log("data destroy".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error.message.red.inverse);
    process.exit();
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
