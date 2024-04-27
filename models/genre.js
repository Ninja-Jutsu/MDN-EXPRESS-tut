const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AuthorSchema = new Schema({
  name: { type: String, required: true, maxLength: 100, minLength: 3 },
})

// Virtual for author's URL
AuthorSchema.virtual('url').get(function () {
  return `/catalog/genre/${this._id}`
})

// Export model
module.exports = mongoose.model('Genre', AuthorSchema)
