const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// In-memory data store for items
let items = [];

/**
 * Create a new item
 * POST /items
 * Body: { name: string, description: string }
 */
app.post('/items', (req, res) => {
    const { name, description } = req.body;
    
    // Check if the request body has valid data
    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
    }

    const newItem = {
        id: items.length + 1, // Auto-increment ID
        name,
        description
    };
    
    items.push(newItem); // Add the new item to the store
    res.status(201).json(newItem); // Respond with the created item
});

/**
 * Get all items
 * GET /items
 */
app.get('/items', (req, res) => {
    res.json(items); // Respond with the list of items
});

/**
 * Get an item by ID
 * GET /items/:id
 */
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = items.find(i => i.id === id);
    
    if (item) {
        res.json(item); // Respond with the found item
    } else {
        res.status(404).json({ error: 'Item not found' }); // Respond with an error if item not found
    }
});

/**
 * Update an item by ID
 * PUT /items/:id
 * Body: { name?: string, description?: string }
 */
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = items.findIndex(i => i.id === id);
    
    if (index !== -1) {
        const { name, description } = req.body;
        
        // Update the item with provided fields
        const updatedItem = {
            ...items[index],
            name: name || items[index].name,
            description: description || items[index].description
        };
        
        items[index] = updatedItem; // Replace the old item with the updated one
        res.json(updatedItem); // Respond with the updated item
    } else {
        res.status(404).json({ error: 'Item not found' }); // Respond with an error if item not found
    }
});

/**
 * Delete an item by ID
 * DELETE /items/:id
 */
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = items.findIndex(i => i.id === id);
    
    if (index !== -1) {
        items.splice(index, 1); // Remove the item from the store
        res.status(204).end(); // Respond with no content
    } else {
        res.status(404).json({ error: 'Item not found' }); // Respond with an error if item not found
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
