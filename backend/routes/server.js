const { v4: uuidv4 } = require("uuid");
const express = require("express");
const cors = require('cors');
const app = express();

const bcrypt = require("bcryptjs");

//Connect with MongoDB
const mongoose = require('mongoose');
const usersRouter = require('./users');


//for authentication token
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || 'xxx';

const auth = require("../auth");

const fs = require("fs");
const port = 3000;
const path = require("path");
const regexEnum = require("../constants/regexEnum");
app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);

const userDB = path.resolve("../database/user.json");

app.get("/", (req, res) => {
  res.send("Hello, world!");
});


//Below APIs will be deprecated and replaced by MongoDB
//GET user by userID
app.get("/:userID", (req, res) => {
  try {
    const userID = req.params.userID;
    const userData = JSON.parse(fs.readFileSync(userDB));
    const user = userData.find((user) => user.userId === userID);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      const { userId, userEmail, userPassword } = user;
      res.json({ userId, userEmail, userPassword });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

//sign up
app.post("/auth/signup", async (req, res) => {
  const { email, password, password_confirm } = req.body;
  function isEmail(email) {
    return regexEnum.EMAIL.test(email);
  }
  let isValidEmail = isEmail(email);
  // validate the data here the email should be an actual email, password should be crypted
  if (isValidEmail && password === password_confirm) {
    if (
      password.length >= 8 &&
      password.match(regexEnum.UPPER_CASE) &&
      password.match(regexEnum.NUMBER) &&
      !password.match(regexEnum.SPECIAL_CHAR)
    ) {
      try {
        const cryptedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const user = {
          userId: userId,
          userEmail: email,
          userPassword: cryptedPassword,
        };
        console.log({ user });

        fs.readFile(userDB, "utf-8", (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error reading user data" });
          }

          let users = JSON.parse(data);

          const userExists =
            users.length && users.some((user) => user.userEmail === email);
          if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
          }

          users.push(user);

          // Convert the users array to JSON format
          const usersJSON = JSON.stringify(users, null, 2);
          fs.writeFile(userDB, usersJSON, (err) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ message: "Error writing user data" });
            }
            console.log("Response saved to user.json");

            return res.status(201).json({
              message: "User created successfully!",
              // user: user, # we DONT WANT THE USER TO SEE THE HASHED PASSWORD
            });
          });
        });
      } catch (error) {
        console.log(`error occurred ${error}`);
      }
    } else if (password.length < 8) {
      res.status(400).json({
        message: "Password should be 8 characters or more",
      });
    } else if (!password.match(regexEnum.UPPER_CASE)) {
      res.status(400).json({
        message: "Password should have at least one upper",
      });
    } else if (!password.match(regexEnum.NUMBER)) {
      res.status(400).json({
        message: "Password should have at least one number",
      });
    } else if (password.match(regexEnum.SPECIAL_CHAR)) {
      res.status(400).json({
        message: "Password should not have any symbol",
      });
    }
  } else if (!isValidEmail) {
    res.status(400).json({
      message: "Wrong email format",
    });
  } else {
    res.status(400).json({
      message: "Password doesn't match",
    });
  }
});

//log in
app.post("/auth/signin", async (req, res) => {
  const { email, password } = req.body;

  fs.readFile(userDB, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error reading user data" });
    }
    const users = JSON.parse(data);

    const user = users.find((u) => u.userEmail === email);
    if (!user) {
      return res.status(401).json({ message: "Email does not exist" });
    }

    bcrypt.compare(password, user.userPassword, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error comparing passwords" });
      }
      if (!result) {
        return res.status(401).json({ message: "Wrong password" });
      }

      const token = jwt.sign(
        { userId: user.userId, userEmail: user.userEmail },
        secretKey
      );
      res.status(200).json({ message: "Login successful", token: token });
    });
  });
});

app.get("/auth/welcome", auth, (req,res) => {
  res.status(200).json({ message: `Congrats! You're authenticated. ${req.user.userEmail}` });
});

//Jinju will provide confidential
// const uri = "";

// mongoose.connect(process.env.MONGO_URI || uri,{
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('MongoDB connected');
// }).catch((err) => {
//   console.log('MongoDB connection error', err)
// });

app.listen(port, () => {
  console.log(
    `welcome to Mentor-Mentee matching platform running on port: ${port}`
  );
});
