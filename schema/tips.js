const mongoose = require('mongoose');

const options = { toJSON: { virtuals: true } };
const tipSchema = new mongoose.Schema({
    Cname: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        required: true
    },
    address: {
        type: String,
    },
    crime: {
        type: String,
        enum: ['Felony', 'Property Crime', 'Financial Crime', 'Organised Crime', 'Public Order Crime']
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
    imgDescription: {
        type: String,
        enum: ['Suspect', 'Crime Scene', 'Evidence']
    },
    priority: {
        type: Number,
        enum: [1, 2, 3]
    }
}, options)

tipSchema.virtual('properties.popUp').get(function () {
    return `${this.address}`
});

const Tip = mongoose.model('Tip', tipSchema);

module.exports = Tip;