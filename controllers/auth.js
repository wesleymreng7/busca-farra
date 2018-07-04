const User = require('../models/usuarios')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy


passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})
// estratégia login local
passport.use(new LocalStrategy(async(username, password, done) => {
    const user = await User.findOne({ username })
    if(user) {
        const isValid = await user.checkPassword(password)
        if(isValid) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } else {
        return done(null, false)
    }
}))

// estratégia login facebook
passport.use(new FacebookStrategy({
    clientID: '202781317186163',
    clientSecret: '9ea88a1b76c30baba627ab2e2392aa3d',
    callbackURL: 'http://localhost:3000/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'photos']
}, async(acessToken, refreshToken, profile, done) => {
    const userDB = await User.findOne({ facebookId: profile.id})
    if(!userDB) {
        const user = new User({
            name: profile.displayName,
            facebookId: profile.id,
            roles: ['restrito']
        })
        await user.save()
        done(null, user)
    } else {
        done(null, userDB)
    }
}))

// estratégia login google
passport.use(new GoogleStrategy({
    clientID: '369981841190-den0d78jf5kvsm6vpvpunmg46q4f0mep.apps.googleusercontent.com',
    clientSecret: 'pFwowsxSBZjoXiQeejioSGDD',
    callbackURL: 'http://localhost:3000/google/callback'
}, async(acessToken, refreshToken, err, profile, done) => {
    const userDB = await User.findOne({ googleId: profile.id})
    if(!userDB) {
        const user = new User({
            name: profile.displayName,
            googleId: profile.id,
            roles: ['restrito']
        })
        await user.save()
        done(null, user)
    } else {
        done(null, userDB)
    }
}))

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}
module.exports = {
    passport,
    logout
}