const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

// const asyncHandler = require("express-async-handler");

exports.index = async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  ] = await Promise.all([// Because the queries for document counts are independent of each other we use Promise.all() to run them in parallel. 
  //! THEY EITHER ALL SUCCEED OR FAIL (if an err is caught by asyncHandler it will be passed to the next middleware)
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: "Available" }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local Library Home",
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres,
  });
}

// Display list of all books.
exports.book_list = async (req, res, next) => {
  const allBooks = await Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec();
    console.log(allBooks)

  res.render("book_list", { title: "Book List", book_list: allBooks });
};

// Display detail page for a specific book.
exports.book_detail = async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`)
}

// Display book create form on GET.
exports.book_create_get = async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book create GET')
}

// Handle book create on POST.
exports.book_create_post = async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book create POST')
}

// Display book delete form on GET.
exports.book_delete_get = async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book delete GET')
}

// Handle book delete on POST.
exports.book_delete_post = async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book delete POST')
}

// Display book update form on GET.
exports.book_update_get = async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book update GET')
}

// Handle book update on POST.
exports.book_update_post = async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book update POST')
}
