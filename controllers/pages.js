
const multer = require('multer')
const fs = require('fs')
const mongoose = require('mongoose')
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
    const pageSize = parseInt(params.pageSize) || 10
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
const index = async( { Evento } ,req, res) => {
    const results = await pagination(Evento, {}, req.query)
    res.render('pages/home', { results })
}
const farras = async( { Evento } ,req, res) => {
    res.render('pages/minhas-farras')
}
const eventosPagination = async( { Evento } , req, res) => {
    const results = await pagination(Evento, {}, req.query)
    res.send(results)
}
const like = async( { Evento, Usuario } , req, res) => {
    try {
        let totalLikes = 0
        const { id_user, id_event } = req.body
        const user = await Usuario.findOne({ _id: id_user })
        if(user.likes.indexOf(id_event) == -1) {
            await Usuario.updateOne({ _id: id_user }, { $push: { likes: id_event } })
            await Evento.updateOne({ _id: id_event }, { $push: { likes: user } })
            res.locals.user.likes.push(id_event)
            const event = await Evento.findOne({ _id: id_event})
            totalLikes = event.likes.length
            res.send({
                result: true,
                totalLikes
            })
        } else {
            const index = res.locals.user.likes.indexOf(id_event)
            await Usuario.updateOne({ _id: id_user }, { $pull: { likes: id_event } })
            await Evento.updateOne({ _id: id_event }, { $pull: { likes: { username: user.username} } })
            res.locals.user.likes.splice(index, 1)
            console.log(res.locals.user.likes)
            const event = await Evento.findOne({ _id: id_event})
            totalLikes = event.likes.length
            res.send({
                result: false,
                totalLikes
            })
        }
    } catch(e) {
        console.log(e)
    }
    
}
const calendar = async( { Evento, Usuario } , req, res) => {
    try {
        let totalPresents = 0
        const { id_user, id_event } = req.body
        const user = await Usuario.findOne({ _id: id_user })
        if(user.events.indexOf(id_event) == -1) {
            await Usuario.updateOne({ _id: id_user }, { $push: { events: id_event } })
            await Evento.updateOne({ _id: id_event }, { $push: { presents: user } })
            res.locals.user.events.push(id_event)
            const event = await Evento.findOne({ _id: id_event})
            totalPresents = event.presents.length
            res.send({
                result: true,
                totalPresents
            })
        } else {
            const index = res.locals.user.events.indexOf(id_event)
            await Usuario.updateOne({ _id: id_user }, { $pull: { events: id_event } })
            await Evento.updateOne({ _id: id_event }, { $pull: { presents: { username: user.username} } })
            res.locals.user.events.splice(index, 1)
            console.log(res.locals.user.likes)
            const event = await Evento.findOne({ _id: id_event})
            totalPresents = event.presents.length
            res.send({
                result: false,
                totalPresents
            })
        }
    } catch(e) {
        console.log(e)
    }
    
}
const my_events = async( { Evento, Usuario } , req, res) => {
    try {
        const id_user = req.query.id_user
        //const data = req.query.data
        const results = await Evento.find({
            "presents": { $elemMatch:  { _id: mongoose.Types.ObjectId(id_user) } }
        })
        res.send(results)
    } catch(e) {
        console.log(e)
    }
    
}

/*const index = async( { Evento } ,req, res) => {
    const docs = await pagination(Evento, {})
    res.render('Eventos/index', { Eventos: docs, labels })
}*/
const createUser = async({ Usuario, Evento }, req, res) => {
    const user = new Usuario({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    })
    try {
        await user.save()
        res.redirect('/')
    } catch (e) {
        res.render('pages/registro', {
            errors: Object.keys(e.errors)
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

const event = async({ Evento, Local }, req, res) => {
    const evento = await Evento.findOne({ _id: req.params.id})
    const local = await Local.findOne({ _id: evento.local})
    res.render('pages/evento', { evento, local })
}
const local = async({ Local }, req, res) => {
    const local = await Local.findOne({ _id: req.params.id})
    res.render('pages/local', { local })
}
const login = async({ Local }, req, res) => {
    res.render('pages/login')
}
const info = async({ Evento }, req, res) => {
    const evento = await Evento.findOne({ _id: req.params.id})
    res.render('Eventos/info', { evento })
}
const signup = async({ Evento }, req, res) => {
    res.render('pages/registro')
}
const addComentario = async( {Evento}, req, res) => {
    await evento.updateOne({ _id: req.params.id }, { $push: { comments: req.body.comentario}})
    res.redirect('/Eventos/info/'+req.params.id)
}
module.exports = {
    index,
    createForm,
    createUser,
    deleteOne,
    updateProcess,
    updateForm,
    info,
    addComentario,
    upload,
    event,
    local,
    login,
    signup,
    eventosPagination,
    like,
    calendar,
    my_events,
    farras
}