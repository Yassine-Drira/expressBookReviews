const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
    return res.json({ message: "Login successful", accessToken: token });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username;
  
  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.json({ message: "Review added successfully" });
  }
  return res.status(404).json({ message: "ISBN not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
