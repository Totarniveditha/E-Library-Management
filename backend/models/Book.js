const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  author: {
    type: String,
    required: true
  },

  category: {
    type: String,
    default: ''
  },

  pdfUrl: {
    type: String
  },

  downloads: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Book", bookSchema);