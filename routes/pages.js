const express = require('express')
const pagesController = require('../controllers/pages')

const router = express.Router()
const Evento = require('../models/eventos')
const Local = require('../models/locais')
const Usuario = require('../models/usuarios')
const models = {
    Evento,
    Local,
    Usuario
}

router.get('/', pagesController.index.bind(null, models))
router.get('/my-events', pagesController.my_events.bind(null, models))
router.get('/farras', pagesController.farras.bind(null, models))
router.post('/like', pagesController.like.bind(null, models))
router.post('/calendar', pagesController.calendar.bind(null, models))
router.get('/eventos', pagesController.eventosPagination.bind(null, models))
router.get('/evento/:id/:slug', pagesController.event.bind(null,models))
router.get('/local/:id/:slug', pagesController.local.bind(null,models))
router.get('/login', pagesController.login.bind(null,models))
router.get('/registro', pagesController.signup.bind(null, models))
router.post('/registro', pagesController.createUser.bind(null, models))
router.get('/excluir/:id', pagesController.deleteOne.bind(null, models))
router.post('/editar/:id', pagesController.updateProcess.bind(null, models))
router.get('/editar/:id', pagesController.updateForm.bind(null, models))
router.get('/info/:id', pagesController.info.bind(null, models))
router.post('/info/:id', pagesController.addComentario.bind(null, models))

module.exports = router