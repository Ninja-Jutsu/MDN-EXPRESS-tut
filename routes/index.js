const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'WORLD', Name: 'Ismail' })
// })

mongoose
  .connect('mongodb+srv://ninja:7.Orangina@cluster0.bzsjq4g.mongodb.net/')
  .then(() => console.log('Connectd to MongoDB..'))

router.get('/', function (req, res) {
  res.redirect('/catalog')
})
module.exports = router

//  Note: This is our first use of the redirect() response method.
//  This redirects to the specified page, by default sending HTTP status code "302 Found".
//  You can change the status code returned if needed, and supply either absolute or relative paths.
