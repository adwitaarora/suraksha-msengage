const mongoose = require('mongoose');

const options = { toJSON: { virtuals: true } };
const reportSchema = new mongoose.Schema({
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
    criminal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Criminal"
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
    priority: {
        type: Number,
        enum: [1, 2, 3]
    }
}, options)

reportSchema.virtual('properties.popUp').get(function () {
    return `${this.address}`;
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;