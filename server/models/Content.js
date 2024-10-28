const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['youtube', 'ebook', 'podcast'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  link: String,
  description: String
});

module.exports = mongoose.model('Content', ContentSchema);