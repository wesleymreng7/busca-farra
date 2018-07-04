const express = require('express')
const eventosController = require('../controllers/eventos')

const router = express.Router()
const Evento = require('../models/eventos')
const Local = require('../models/locais')
const models = {
    Evento,
    Local
}

router.get('/', eventosController.index.bind(null, models))
router.get('/cadastrar', eventosController.createForm.bind(null, models))
router.post('/cadastrar', eventosController.upload.single('img'), eventosController.createProcess.bind(null, models))
router.get('/excluir/:id', eventosController.deleteOne.bind(null, models))
router.post('/editar/:id', eventosController.updateProcess.bind(null, models))
router.get('/editar/:id', eventosController.updateForm.bind(null, models))
router.get('/info/:id', eventosController.info.bind(null, models))
router.post('/info/:id', eventosController.addComentario.bind(null, models))

module.exports = router