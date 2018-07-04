const express = require('express')
const locaisController = require('../controllers/locais')

const router = express.Router()
const Local = require('../models/locais')
const models = {
    Local
}

router.get('/', locaisController.index.bind(null, models))
router.get('/cadastrar', locaisController.createForm)
router.post('/cadastrar', locaisController.upload.single('img'), locaisController.createProcess.bind(null, models))
router.get('/excluir/:id', locaisController.deleteOne.bind(null, models))
router.post('/editar/:id', locaisController.updateProcess.bind(null, models))
router.get('/editar/:id', locaisController.updateForm.bind(null, models))
router.get('/info/:id', locaisController.info.bind(null, models))
router.post('/info/:id', locaisController.addComentario.bind(null, models))

module.exports = router