var express = require('express');
var router = express.Router();

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

/* GET All the books listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Books.findAll();
  console.log(books);
  //res.render("index", { Books, title: "Sequelize-It!" });
}));




module.exports = router;
