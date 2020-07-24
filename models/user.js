const mongoose = require('mongoose');

// Define the schema
const schema = mongoose.Schema({
    staff: { type: mongoose.Types.ObjectId, unique: true, required: true, ref: 'Staff' },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    active: { type: Boolean },
});

module.exports = mongoose.model('User', schema);