const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')
mongoose.Promise = global.Promise


//rotas
const eventosRouter = require('./routes/eventos')
const locaisRouter = require('./routes/locais')
const pagesRouter = require('./routes/pages')
const auth = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: true}))
app.use(session({ secret: 'full-stack-master', resave: false, saveUninitialized: true}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
const allowedOrigins = ['http://192.168.1.7:3000',
                      'http://wesley:3000',
                      'http://localhost:3000'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


const mongo = process.env.MONGODB || 'mongodb://localhost/busca-farra'

app.use('/',auth)
app.use('/', pagesRouter)
app.get('/admin', (req, res) => res.render('admin/home'))
app.use('/admin/eventos', eventosRouter)
app.use('/admin/locais', locaisRouter)

mongoose.connect(mongo).then(() => {
    //createInitialUser()
    app.listen(port, () => console.log('running'))
}).catch(e => console.log(e))