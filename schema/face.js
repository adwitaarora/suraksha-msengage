const mongoose = require('mongoose');

const faceSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        unique: true,
    },
    descriptions: {
        type: Array,
        required: true,
    }

});

const Face = mongoose.model('Face', faceSchema);

module.exports = Face;