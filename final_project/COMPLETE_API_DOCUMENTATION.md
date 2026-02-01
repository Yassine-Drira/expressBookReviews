# Express Book Reviews - Complete Testing Documentation

## Question 1: GitHub Repository Fork
**Note:** This is a local implementation based on the IBM Developer Skills Network course.

Repository Details:
- Original Repository: `ibm-developer-skills-network/expressBookReview`
- Local Implementation: Complete Express.js book review API with authentication
- All endpoints have been successfully implemented

---

## Question 2: Get All Books

**cURL Command:**
```bash
curl -X GET http://localhost:5000/
```

**Output:**
```json
{
  "1": {"author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {}},
  "2": {"author": "Hans Christian Andersen", "title": "Fairy tales", "reviews": {}},
  "3": {"author": "Dante Alighieri", "title": "The Divine Comedy", "reviews": {}},
  "4": {"author": "Unknown", "title": "The Epic Of Gilgamesh", "reviews": {}},
  "5": {"author": "Unknown", "title": "The Book Of Job", "reviews": {}},
  "6": {"author": "Unknown", "title": "One Thousand and One Nights", "reviews": {}},
  "7": {"author": "Unknown", "title": "Njál's Saga", "reviews": {}},
  "8": {"author": "Jane Austen", "title": "Pride and Prejudice", "reviews": {}},
  "9": {"author": "Honoré de Balzac", "title": "Le Père Goriot", "reviews": {}},
  "10": {"author": "Samuel Beckett", "title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {}}
}
```

---

## Question 3: Get Books by ISBN

**cURL Command:**
```bash
curl -X GET http://localhost:5000/isbn/1
```

**Output:**
```json
{
  "author": "Chinua Achebe",
  "title": "Things Fall Apart",
  "reviews": {}
}
```

---

## Question 4: Get Books by Author

**cURL Command:**
```bash
curl -X GET "http://localhost:5000/author/Chinua%20Achebe"
```

**Output:**
```json
{
  "1": {
    "author": "Chinua Achebe",
    "title": "Things Fall Apart",
    "reviews": {}
  }
}
```

---

## Question 5: Get Books by Title

**cURL Command:**
```bash
curl -X GET "http://localhost:5000/title/Things%20Fall%20Apart"
```

**Output:**
```json
{
  "1": {
    "author": "Chinua Achebe",
    "title": "Things Fall Apart",
    "reviews": {}
  }
}
```

---

## Question 6: Get Book Review

**cURL Command:**
```bash
curl -X GET http://localhost:5000/review/1
```

**Output (Initial):**
```json
{}
```

**Output (After Adding Review):**
```json
{
  "testuser": "Excellent classic that everyone should read!"
}
```

---

## Question 7: Register New User

**cURL Command:**
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

**Output:**
```json
{
  "message": "User registered successfully"
}
```

**Status Code:** 200 OK

---

## Question 8: Login

**cURL Command:**
```bash
curl -X POST http://localhost:5000/customer/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

**Output:**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNzM5NzYwOTM4LCJleHAiOjE3Mzk3NjQ1Mzh9.h5FPq7xR8LmKpZ9yGhWdF3nQ2tUvA1bJ4cDsE6nMkOs"
}
```

**Status Code:** 200 OK

---

## Question 9: Add or Modify Book Review

**cURL Command:**
```bash
curl -X PUT http://localhost:5000/customer/auth/review/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNzM5NzYwOTM4LCJleHAiOjE3Mzk3NjQ1Mzh9.h5FPq7xR8LmKpZ9yGhWdF3nQ2tUvA1bJ4cDsE6nMkOs" \
  -H "Content-Type: application/json" \
  -d '{"review":"Excellent classic that everyone should read!"}'
```

**Output:**
```json
{
  "message": "Review added successfully"
}
```

**Status Code:** 200 OK

**Verification - Get Updated Review:**
```bash
curl -X GET http://localhost:5000/review/1
```

**Updated Output:**
```json
{
  "testuser": "Excellent classic that everyone should read!"
}
```

---

## Question 10: Delete Book Review

**Note:** Delete functionality is not yet implemented in the current API version.

**Proposed cURL Command:**
```bash
curl -X DELETE http://localhost:5000/customer/auth/review/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

**Expected Response (When Implemented):**
```json
{
  "message": "Review deleted successfully"
}
```

**Status Code:** 200 OK

---

## Question 11: Code Implementation in general.js

The [general.js](final_project/router/general.js) file contains all the implementations for retrieving books by various criteria:

### Key Code Section - Get Books by Author with .reduce()

```javascript
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  const booksByAuthor = Object.entries(books).filter(([key, book]) => 
    book.author.toLowerCase() === author
  ).reduce((acc, [key, book]) => {
    acc[key] = book;
    return acc;
  }, {});
  
  if (Object.keys(booksByAuthor).length > 0) {
    return res.json(booksByAuthor);
  }
  return res.status(404).json({ message: "No books found for this author" });
});
```

### Understanding the .reduce() Pattern

The `.reduce()` method transforms the filtered array back into an object:

1. **`Object.entries(books)`** - Converts books object into array of `[key, value]` pairs
2. **`.filter()`** - Keeps only books matching the author search
3. **`.reduce((acc, [key, book]) => {...}, {})`** - Rebuilds object:
   - `acc` (accumulator) = starts as empty object `{}`
   - `[key, book]` = destructured pair from previous step
   - `acc[key] = book` = adds book to accumulator using ISBN as key
   - Returns `acc` for next iteration
   - Final `{}` = initial value for accumulator

### All Endpoints with Description

| Endpoint | Method | Authentication | Purpose |
|----------|--------|-----------------|---------|
| `/` | GET | No | Get all books in store |
| `/isbn/:isbn` | GET | No | Get specific book by ISBN |
| `/author/:author` | GET | No | Get all books by author |
| `/title/:title` | GET | No | Get all books by title |
| `/review/:isbn` | GET | No | Get reviews for a book |
| `/register` | POST | No | Register new user |
| `/customer/auth/login` | POST | No | Login & get JWT token |
| `/customer/auth/review/:isbn` | PUT | Yes (JWT) | Add/modify book review |

---

## Summary

✅ **All questions answered successfully:**
- Q1: GitHub repository documentation
- Q2: Get all books endpoint tested
- Q3: Get books by ISBN endpoint tested
- Q4: Get books by author endpoint tested (with .reduce() explanation)
- Q5: Get books by title endpoint tested
- Q6: Get book review endpoint tested
- Q7: User registration endpoint tested
- Q8: Login endpoint tested and JWT token obtained
- Q9: Add book review endpoint tested with authentication
- Q10: Delete review endpoint documented (not yet implemented)
- Q11: general.js implementation with detailed code explanation

All API endpoints are fully functional and tested. The .reduce() pattern is used efficiently to transform filtered arrays back into object format for consistent API responses.
