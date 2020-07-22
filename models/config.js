const mongoose = require('mongoose');

// Define the schema
const schema = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, maxlength: 50, },
    registration: String,
    address: {
        country: String,
        region: String,
        department: String,
        borough: String,
        city: String,
        postal_code: Number,
        core: String,
    },
    motto: String,
    chief: String,
    email: String,
    phone: { type: String, maxlength: 15, },
});

module.exports = mongoose.model('Config', schema, 'config');