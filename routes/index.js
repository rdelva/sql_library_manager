var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET listing of all the books. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  console.log(books);
  //console.log(books.map(book => book.toJSON()) );
  res.render("index", { books, title: "Books" });
}));




module.exports = router;
