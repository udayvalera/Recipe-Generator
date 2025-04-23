// controllers/itemController.js
const Item = require('../models/Item');

// @desc    Add a new item
// @route   POST /api/items/add
// @access  Public
exports.addItem = async (req, res) => {
  try {
    const { item } = req.body;
    if (!item || typeof item !== 'string' || item.trim() === '') {
      return res.status(400).json({ message: 'Item name is required and must be a non-empty string.' });
    }

    const itemNameTrimmed = item.trim();

    // More robust check for existing item (case-insensitive)
    const existingItem = await Item.findOne({ name: { $regex: new RegExp(`^${itemNameTrimmed}$`, 'i') } });
    if (existingItem) {
        return res.status(409).json({ message: `Item '${itemNameTrimmed}' already exists.` });
    }

    const newItem = new Item({ name: itemNameTrimmed });
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
     // Handle potential duplicate key errors explicitly if needed (though findOne should catch it)
    if (error.code === 11000) {
         return res.status(409).json({ message: `Item already exists.` });
    }
    res.status(500).json({ message: 'Failed to add item', error: error.message });
  }
};

// @desc    Get all items
// @route   GET /api/items
// @access  Public
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ name: 1 }); // Sort alphabetically
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
};