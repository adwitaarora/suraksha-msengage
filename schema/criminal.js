const mongoose = require('mongoose');
const Report = require('./report')

const criminalSchema = new mongoose.Schema({
    Sname: {
        type: String,
        default: 'Unknown',
        // required: true
    },
    age: {
        default: 0,
        type: Number,
    },
    height: {
        default: 0,
        type: Number,
        // required: true
    },
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report"
    }
    ,
    faces: [
        {
            url: String,
            filename: String
        }
    ]
})

const Criminal = mongoose.model('Criminal', criminalSchema);

module.exports = Criminal;