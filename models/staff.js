const mongoose = require('mongoose');

// Define the schema
const schema = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: String,
    birthdate: { type: Date, required: true },
    birthplace: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, unique: true, required: true },
    email: { type: String, unique: true },
    avatar: String,
    type: { type: String, required: true },
});

module.exports = mongoose.model('Staff', schema, 'staff');