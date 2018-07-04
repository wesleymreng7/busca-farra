const mongoose = require('mongoose')

const EventoSchema = mongoose.Schema({
    title: { 
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    local: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Local'
    },
    description: {
        type: String,
        required: true
    },
    likes: [{}],
    presents: [{}]
})

const Evento = mongoose.model('Evento', EventoSchema)
module.exports = Evento