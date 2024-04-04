import jwt from "jsonwebtoken";
import axios from "axios";
import asynchandler from "express-async-handler";

export const verify_google_reCaptcha = asynchandler(async (token, res) => {
  if (token) {
    const googleVrifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
    const response = await axios.post(googleVrifyUrl);
    const { success } = response.data;
    if (!success) {
      res.status(400);
      throw new Error("Not a Human");
    }
  } else {
    throw new Error("Please refresh the page");
  }
});

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
