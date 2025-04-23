// routes/itemRoutes.js
const express = require('express');
const { addItem, getAllItems } = require('../controllers/itemController');

const router = express.Router();

router.post('/add', addItem); // Maps to POST /api/items/add
router.get('/', getAllItems);   // Maps to GET /api/items

module.exports = router;