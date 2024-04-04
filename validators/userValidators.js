import { check } from "express-validator";

export const signupValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Need strong password of minimum character 6"),
];

export const signinValidator = [
  check("email").isEmail().withMessage("Email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Need strong password of minimum character 6"),
];

export const profileValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
];
