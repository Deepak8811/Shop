import asynchandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken, verify_google_reCaptcha } from "../Utils/utils.js";

// @desc  POST auth user and get token
// @router POST /api/users/login
// @access public
export const authUser = asynchandler(async (req, res) => {
  const { email, password, google_recaptcha_token } = req.body;
  // verify_google_reCaptcha(google_recaptcha_token, res);
  const user = await User.findOne({ email }).exec();
  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  }
  res.status(404);
  throw new Error("Invalid email or password");
});

// @desc  POST register new user
// @router POST /api/users
// @access public
export const registerUser = asynchandler(async (req, res) => {
  const { name, email, password, google_recaptcha_token } = req.body;
  // verify_google_reCaptcha(google_recaptcha_token, res);
  const userExists = await User.findOne({ email }).exec();
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
  res.status(404);
  throw new Error("Invalid email or password");
});

// @desc    user profile
// @router GET /api/users/profile
// @access private
export const userProfile = asynchandler(async (req, res) => {
  const user = await User.findById({ _id: req.user._id }).exec();
  if (user) {
    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
  res.status(404);
  throw new Error("User not found");
});

// @desc    update user profile
// @router  POST /api/users/:id
// @access Private
export const updateUserProfile = asynchandler(async (req, res) => {
  const user = await User.findById({ _id: req.user._id }).exec();
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updateUser = await user.save();
    return res.json({
      _id: updateUser.id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      token: generateToken(updateUser._id),
    });
  }
  res.status(404);
  throw new Error("User not found");
});

// @desc    get all users
// @router GET /api/users
// @access Private/Admin
export const getUsers = asynchandler(async (req, res) => {
  const users = await User.find({}).exec();
  res.json(users);
});

// @desc    delete user
// @router DELETE /api/users/:id
// @access Private/Admin
export const deleteUser = asynchandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.status(201).json({
      message: "User Deleted",
    });
  } else {
    throw new Error("User Not Found");
  }
});

// @desc    get user by id
// @router GET /api/users
// @access Private/Admin
export const getUserById = asynchandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

// @desc    update user by admin
// @router  PUT /api/users/:id
// @access Private/admin
export const updateUser = asynchandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;
    const updateUser = await user.save();

    return res.json({
      _id: updateUser.id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  }
  res.status(404);
  throw new Error("User not found");
});
