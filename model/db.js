const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// imarya private database
const InventorySchema = new Schema({
    SKU: {
        type: String,
        unique: true,
    },
    Location: String,
    VendorSKU: String,
    Vendor: String,
    Size: String,
    Qty: String, 
    createDay: {
        type: Date,
        default: Date.now
    }
});

const Inventory = mongoose.model('inventory', InventorySchema);

module.exports = {
    Inventory: Inventory,
};