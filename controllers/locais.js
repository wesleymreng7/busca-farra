
const multer = require('multer')
const fs = require('fs')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+'-'+file.originalname)
    }
})
const upload = multer({ storage })

const pagination = async(model, conditions, params) => {
    const total = await model.count(conditions)
    const pageSize = parseInt(params.pageSize) || 20
    const currentPage = parseInt(params.page) || 0

    const pagination = {
        currentPage: parseInt(currentPage),
        pageSize: parseInt(pageSize),
        pages: parseInt(total/pageSize)
    }
    const results = await model.find(conditions).skip(currentPage * pageSize).limit(pageSize)
    return {
        data: results,
        pagination
    } 
}
const index = async( { Local } ,req, res) => {
    const results = await pagination(Local, {}, req.query)
    res.render('eventos/index', { results })
}
/*const index = async( { Evento } ,req, res) => {
    const docs = await pagination(Evento, {})
    res.render('Eventos/index', { Eventos: docs, labels })
}*/
const createProcess = async({ Local }, req, res) => {
    const local = new Local({
        name: req.body.name,
        description: req.body.description,
        img: req.file.filename,
        position: {
            lat: req.body.latitude,
            lng: req.body.longitude
        }
    })
    try {
        await local.save()
        res.render('admin/locais/cadastrar', { errors: [] })
    } catch (e) {
        res.render('admin/locais/cadastrar', {
            errors: Object.keys(e.errors)
        })
    }
}
const createForm = (req, res) => {
    res.render('admin/locais/cadastrar', { errors: [] })
}
const deleteOne = async( { Evento }, req, res) =>{
    await Evento.remove({
        _id: req.params.id
    })
    res.redirect('/Eventos')
}
const updateProcess = async({ Evento }, req, res) => {
    const evento = await Evento.findOne({
        _id: req.params.id
    }) 
    evento.name = req.body.name,
    evento.status = req.body.status
    try {
        await evento.save()
        res.redirect('/Eventos')
    }catch(e) {
        res.render('Eventos/editar', { evento, labels, errors: Object.keys(e.errors) })
    }
    
}
const updateForm = async({ Evento }, req, res) => {
    const evento = await Evento.findOne({
        _id: req.params.id
    })
    res.render('Eventos/editar', { evento, labels, errors: [] })
    
}

const info = async({ Evento }, req, res) => {
    const evento = await Evento.findOne({ _id: req.params.id})
    res.render('Eventos/info', { evento })
}

const addComentario = async( {Evento}, req, res) => {
    await evento.updateOne({ _id: req.params.id }, { $push: { comments: req.body.comentario}})
    res.redirect('/Eventos/info/'+req.params.id)
}
module.exports = {
    index,
    createForm,
    createProcess,
    deleteOne,
    updateProcess,
    updateForm,
    info,
    addComentario,
    upload
}