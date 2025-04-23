// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    unique: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);