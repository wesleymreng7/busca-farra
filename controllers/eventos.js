
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
    const pageSize = parseInt(params.pageSize) || 3
    const currentPage = parseInt(params.page) || 0

    const pagination = {
        currentPage: parseInt(currentPage),
        pageSize: parseInt(pageSize),
        pages: parseInt(total/pageSize)
    }
    const results = await model.find(conditions).skip(currentPage * pageSize).limit(pageSize)
    return {
        data: res.send(JSON.parse(results)),
        pagination
    } 
}
const index = async( { Evento } ,req, res) => {
    //const results = await pagination(Evento, {}, req.query)
    res.render('eventos/index', { results })
}
/*const index = async( { Evento } ,req, res) => {
    const docs = await pagination(Evento, {})
    res.render('Eventos/index', { Eventos: docs, labels })
}*/
const createProcess = async({ Evento, Local }, req, res) => {
    const evento = new Evento({
        title: req.body.title,
        date: req.body.date,
        hour: req.body.hour,
        img: req.file.filename,
        local: req.body.local,
        description: req.body.description
    })
    const locais = await Evento.find({})
    try {
        await evento.save()
        res.render('admin/eventos/cadastrar', { errors: [], locais})
    } catch (e) {
        res.render('admin/eventos/cadastrar', {
            errors: Object.keys(e.errors),
            locais
        })
    }
}
const createForm = async({ Local }, req, res) => {
    const locais = await Local.find({})
    res.render('admin/eventos/cadastrar', { errors: [], locais })
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