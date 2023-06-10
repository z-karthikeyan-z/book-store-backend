const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors"); // Add this line

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors()); // Add this line

app.use(bodyParser.json());

// Read the books.json file
function readBooksFile() {
  const booksData = fs.readFileSync("books.json");
  return JSON.parse(booksData);
}

// Write data to the books.json file
function writeBooksFile(data) {
  fs.writeFileSync("books.json", JSON.stringify(data, null, 2));
}

// Get all books
app.get("/books", (req, res) => {
  const books = readBooksFile();
  res.json(books);
});

// Add a new book
app.post("/books", (req, res) => {
  const books = readBooksFile();
  const newBook = {
    id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
  };

  // Add the new book to the data
  books.data.push(newBook);

  // Save the updated data to the books.json file
  fs.writeFileSync("books.json", JSON.stringify(books, null, 2));

  res.json(newBook);
});

// Modify a book by ID
app.put("/books/:id", (req, res) => {
  const books = readBooksFile();
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;
  const index = books.data.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.data[index] = { ...books.data[index], ...updatedBook };
    writeBooksFile(books);
    res.json(books.data[index]);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

// Delete a book by ID
app.delete("/books/:id", (req, res) => {
  const books = readBooksFile();
  const bookId = parseInt(req.params.id);
  const index = books.data.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    const deletedBook = books.data[index];
    books.data.splice(index, 1);
    writeBooksFile(books);
    res.json(deletedBook);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
