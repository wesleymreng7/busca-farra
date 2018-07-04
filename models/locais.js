const mongoose = require('mongoose')

const LocalSchema = mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    position: {}
})

const Local = mongoose.model('Local', LocalSchema)
module.exports = Local