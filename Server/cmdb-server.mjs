import express from 'express'
import hbs from 'hbs'
import url from 'url'
import path from 'path'

import * as dataMem from './data/cmdb-data-mem.mjs'
import * as moviesdata from './data/cmdb-movies-data.mjs'
import * as dataElastic from './data/cmdb-data-elastic.mjs'
import webApiFunction from './web/api/cmdb-web-api.mjs'
import webSiteFunction from './web/site/cmdb-web-site.mjs'
import servicesFunction from './services/cmdb-services.mjs'
import authRouter from './cmdb-auth-web-site.mjs'

const PORT = 8080

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const services = servicesFunction(dataMem,moviesdata)
const webapi = webApiFunction(services)
const website = webSiteFunction(services)

console.log("Setting up server")

let app = express()

const viewsPath = path.join(__dirname, 'web', 'site', 'views')
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(path.join(viewsPath, 'partials'))

app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.use(authRouter(services))

// Web site routes
app.get('/site', website.getHome)
app.get('/site/user', website.getNewUserForm)
app.get('/site/groups', website.getMyGroups)
app.get('/site/group/new', website.getNewGroupForm)
app.get('/site/group/:id',website.getDetails)
app.get('/site/editGroup/:id',website.getEditGroupForm)
app.get('/site/top',website.getTopMoviesForm)
app.get('/site/movie/search',website.searchMovieForm)
app.post('/site/user', website.createUser)
app.post('/site/top/limit',website.getTopMovies)
app.post('/site/movie',website.searchMovie)
app.post('/site/deleteGroup/:id',website.deleteGroup)
app.post('/site/deleteMovie/:groupId/:movieId',website.deleteMovie)
app.post('/site/addMovie/:groupId',website.addMovie)
app.get('/site/error', website.handleError)

// Web api routes 
app.get('/api/moviesPopular', webapi.getTopMovies)
app.get('/api/movie/:name',webapi.getMovie)
app.get('/api/favoriteMovies/:groupId',webapi.getGroupDetails)  
app.get('/api/favoriteMovies',webapi.getFavoriteMovies) 
app.post('/api/user', webapi.createUser) 
app.post('/api/favoriteMovies', webapi.createGroup) 
app.put('/api/favoriteMovies/:groupId',webapi.editFavoriteMovies)
app.put('/api/favoriteMovies/:groupId/movies/:movieId',webapi.addMovie)
app.delete('/api/favoriteMovies/:groupId',webapi.deleteGroup)
app.delete('/api/favoriteMovies/:groupId/movies/:movieId',webapi.deleteMovie)

app.get('/api/getusers', webapi.getAllUsers) //tests only
app.get('/api/getgroups', webapi.getAllGroups) //tests only

let appServer = app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))

export default{
    app,
    appServer
}