// scripts/loadInitialItems.js
const axios = require('axios');

// List of 10 common ingredients
const commonItems = [
  "Chicken",
  "Butter",
  "Tomato",
  "Onion",
  "Garlic",
  "Potato",
  "Rice",
  "Milk",
  "Egg",
  "Cheese"
];

// Your API endpoint URL (make sure your server is running on this address)
const apiUrl = 'http://localhost:5001/api/items/add';

// Function to add a single item
async function addItem(itemName) {
  console.log(`Attempting to add: ${itemName}...`);
  try {
    const response = await axios.post(apiUrl,
      { item: itemName }, // Request body
      { headers: { 'Content-Type': 'application/json' } } // Headers
    );
    console.log(`  ✅ Success: ${response.data.message || `Added ${itemName}`}`);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || 'Unknown server error';

      if (statusCode === 409) { // 409 Conflict (already exists)
        console.log(`  ⚠️ Info: ${itemName} already exists.`);
      } else {
        console.error(`  ❌ Error adding ${itemName}: ${statusCode} - ${errorMessage}`);
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., server down)
      console.error(`  ❌ Network Error: Could not connect to the server at ${apiUrl}. Is it running?`);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`  ❌ Error adding ${itemName}: ${error.message}`);
    }
  }
}

// Main function to loop through items and add them sequentially
async function loadItems() {
  console.log("--- Starting to load initial items ---");
  for (const item of commonItems) {
    await addItem(item); // Wait for each request to finish before starting the next
    await new Promise(resolve => setTimeout(resolve, 100)); // Optional small delay between requests
  }
  console.log("--- Finished loading initial items ---");
}

// Run the main function
loadItems();