const Book = require('../models/book')
const Author = require('../models/author')
const Genre = require('../models/genre')
const BookInstance = require('../models/bookinstance')
const { body, validationResult } = require('express-validator')

exports.index = async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  ] = await Promise.all([
    // Because the queries for document counts are independent of each other we use Promise.all() to run them in parallel.
    //! THEY EITHER ALL SUCCEED OR FAIL (if an err is caught by asyncHandler it will be passed to the next middleware)
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: 'Available' }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ])

  res.render('index', {
    title: 'Local Library Home',
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres,
  })
}

// Display list of all books.
exports.book_list = async (req, res, next) => {
  const allBooks = await Book.find({}, 'title author')
    .sort({ title: 1 })
    .populate('author')
    .exec()
  console.log(allBooks)

  res.render('book_list', { title: 'Book List', book_list: allBooks })
}

// Display detail page for a specific book.
exports.book_detail = async (req, res, next) => {
  const [book, AllInstances] = await Promise.all([
    Book.findById(req.params.id)
      .populate('author')
      .populate('genre')
      .sort({ name: 1 })
      .exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ])
  if (book === null) {
    const err = new Error('Book not found')
    err.status(404)
    return next(err)
  }

  res.render('book_detail', {
    title: 'Book detail',
    book,
    book_instances: AllInstances,
  })
}

// Display book create form on GET.
exports.book_create_get = async (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().sort({ family_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ])

  res.render('book_form', {
    title: 'Create Book',
    authors: allAuthors,
    genres: allGenres,
  })
}

// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === 'undefined' ? [] : [req.body.genre]
    }
    next()
  },

  // Validate and sanitize fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),
  
  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req)

    // Create a Book object with escaped and trimmed data.
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    })

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ])

      // Mark our selected genres as checked.
      for (const genre of allGenres) {
        if (book.genre.includes(genre._id)) {
          genre.checked = 'true'
        }
      }
      res.render('book_form', {
        title: 'Create Book',
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),
      })
    } else {
      // Data from form is valid. Save book.
      await book.save()
      res.redirect(book.url)
    }
  },
]

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
