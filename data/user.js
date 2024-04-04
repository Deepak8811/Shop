import bcrypt from "bcryptjs";

const user = [
  {
    name: "Admin user",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Jhon Doe",
    email: "jhon@gmail.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "jane",
    email: "jane@gmail.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default user;
