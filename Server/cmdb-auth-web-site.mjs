import express from 'express'
import expressSession from 'express-session'
import passport from 'passport'
import fileStore from 'session-file-store'
import webSiteFunction from './web/site/cmdb-web-site.mjs'

export default function authUiFunction(services){
  
    const website = webSiteFunction(services)
    const router = express.Router()
    const FileStore = fileStore(expressSession)
    router.use(expressSession(
        {
          secret: "CMDB",
          resave: false,
          saveUninitialized: true,
          store: new FileStore()
        }
    ))

    router.use(passport.session())
    router.use(passport.initialize())
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((user, done) => done(null, user))

    router.use('/site/auth/*', verifyAuthenticated) //change this to /auth/*
    router.get('/site/login', website.getLoginForm)
    router.post('/site/login', validateLogin)
    router.post('/site/logout', logout)

    return router

    function logout(req, rsp) {
        req.logout((err) => { 
          rsp.redirect('/site')
        })
    }

    function verifyAuthenticated(req, rsp, next) {
        if(req.user) {
          console.log("$$$$$$$$$$$$$$$$$")
          return next()
        }
        console.log("#################")
        rsp.redirect('/login')
    }

    async function validateLogin(req, rsp) {
        console.log("validateLogin")
        let tempuser = await services.validateUser(req.body.username, req.body.password)
        if(tempuser) {
          const user = {
            username: req.body.username,
            token: 'Bearer ' + tempuser.token,
            id: tempuser.id
          }
          req.login(user, () => rsp.redirect('/site'))
        } else rsp.redirect('/site/login')
    }
}