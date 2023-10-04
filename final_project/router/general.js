const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


//Simulated asynchronous function to fetch books
async function fetchBooks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books)
    }, 3000); // Simulate a delay
  })
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password) {
    if(!isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. You may proceed to login"});
    } else {
      return res.status(200).json({message: "User already exist!"})
    }
  }
  return res.status(404).json({message: "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  // code below with sync
  try {
    const books = await fetchBooks();
    res.json(books);
  } catch (error){
    res.status(500).json({error: "Internal server error"});
  }

  // code below without promises & async
  // res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const books = await fetchBooks();
    const book = books[isbn];
    if(book){
      res.json(book);
    } else {
      res.status(404).json({error:"Book not found"});
    }
  } catch (error) {
    res.status(500).json({error: "Internal server error"});
  }


  // code below without promises & async
  // const isbn = req.params.isbn;
  // res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res)=>{
  const author = req.params.author;

  try {
    const books = await fetchBooks();
    const booksByAuthor = Object.values(books).filter(
      (book) => book.author.includes(author)
    );
    if(booksByAuthor.length > 0){
      res.json(booksByAuthor);
    } else {
      res.status(404).json({error: "No books by this author found"});
    }
  } catch (error) {
    res.status(500).json({error: "Internal server error"});
  }

  //code below without promises & async
  // const author = req.params.author;
  // const matchingBooks = [];

  // //Iterate through the books 
  // for (const key in books){
  //   if(books[key].author == author) {
  //     matchingBooks.push({ key, ...books[key] });
  //   }
  // }

  // //respond with the matching books
  // res.json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) =>{
  const title = req.params.title;
  try {
    const books = await fetchBooks();
    const booksByTitle = Object.values(books).filter(
      (book) => book.title.includes(title)
    )
    if(booksByTitle.length > 0){
      res.json(booksByTitle)
    } else {
      res.status(404).json({error: "No books by this title found"});
    }
  } catch (error) {
    res.status(500).json({error: "Internal server error"});
  }

  //below code without promises & async
  // const title = req.params.title;
  // const matchingBooks = [];

  // //iterate through the books
  // for (const key in books){
  //   if(books[key].title == title){
  //     matchingBooks.push({key, ...books[key] });
  //   }
  // }

  // //respond with the matching books
  // res.json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
