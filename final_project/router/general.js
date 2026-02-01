const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  if (!isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  
  users.push({ username, password });
  return res.json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.json(books);
});

// Get book details based on ISBN (async/await with Axios)
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;
    if (allBooks[isbn]) {
      return res.json(allBooks[isbn]);
    }
    return res.status(404).json({ message: "ISBN not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book by ISBN" });
  }
});
  
// Get book details based on author (async/await with Axios)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;
    const booksByAuthor = Object.entries(allBooks).filter(([key, book]) => 
      book.author.toLowerCase() === author
    ).reduce((acc, [key, book]) => {
      acc[key] = book;
      return acc;
    }, {});
    
    if (Object.keys(booksByAuthor).length > 0) {
      return res.json(booksByAuthor);
    }
    return res.status(404).json({ message: "No books found for this author" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Get all books based on title (async/await with Axios)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;
    const booksByTitle = Object.entries(allBooks).filter(([key, book]) => 
      book.title.toLowerCase() === title
    ).reduce((acc, [key, book]) => {
      acc[key] = book;
      return acc;
    }, {});
    
    if (Object.keys(booksByTitle).length > 0) {
      return res.json(booksByTitle);
    }
    return res.status(404).json({ message: "No books found with this title" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "ISBN not found" });
});

// Add or modify a book review (public /review endpoint)
public_users.put('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const { review, username = "anonymous" } = req.body;

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.json({ message: "Review added successfully", reviews: books[isbn].reviews });
  }
  return res.status(404).json({ message: "ISBN not found" });
});

// Delete a book review (public /review endpoint)
public_users.delete('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const { username = "anonymous" } = req.body;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
    }
    return res.json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
  }
  return res.status(404).json({ message: "ISBN not found" });
});

module.exports.general = public_users;
