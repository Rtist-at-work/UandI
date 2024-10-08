const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category: {
      type: String,
      required: true,
      unique: true
  },
  style: [{
      key: {
          type: String,
          required: true
      },
      value: {
          type: String,
          required: true
      }
  }]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category
