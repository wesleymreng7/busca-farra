const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth')

router.use(authController.passport.initialize())
router.use(authController.passport.session())

router.use((req, res, next) =>{
    if(req.isAuthenticated()) {
        res.locals.user = req.user
    }
    next()
})

router.get('/logout', authController.logout)
router.post('/login', authController.passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}))
router.get('/facebook', authController.passport.authenticate('facebook'))
router.get('/facebook/callback', 
    authController.passport.authenticate('facebook', { failureRedirect: '/'}),
    (req, res) => {
        res.redirect('/')
    }
)
router.get('/google', authController.passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile']}))
router.get('/google/callback', 
    authController.passport.authenticate('google', { failureRedirect: '/', successRedirect: '/'}),
    (req, res) => {
        res.redirect('/')
    }
)

module.exports = router