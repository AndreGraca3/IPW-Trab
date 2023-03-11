import {errors} from '../errors/cmdb-errors.mjs'
import crypto from 'crypto'

export default function(data,moviesdata){
    async function createUser(name,pass){
        let tempuser = await validateUser(name,pass)
        if(tempuser) return Promise.reject(errors.ALREADY_EXISTS('User'))
        let token = crypto.randomUUID()
        let user = await data.createUser(name,pass,token)
        return Promise.resolve(user)
    }

    async function validateUser(name,pass){
        if(!name || !name.trim()) return Promise.reject(errors.INVALID_TEXT('Name'))
        if(!pass || !pass.trim()) return Promise.reject(errors.INVALID_TEXT('Password'))
        let user = await data.getUserbyNameAndPass(name,pass)
        return Promise.resolve(user)
    }

    async function createGroup(token, name, description) { 
        if(!name) return Promise.reject(errors.INVALID_TEXT('Name'))
        if(!description) return Promise.reject(errors.INVALID_TEXT('Description'))
        token = await getToken(token)
        let user = await getUserByToken(token)
        return await data.createGroup(user.id,name,description)
    }

    async function getAllUsers() { // tests only
        return await data.getAllUsers()
    }

    async function getGroup(token, groupId){ 
        token = await getToken(token)
        let user = await getUserByToken(token)
        let group =  await data.getGroup(user.id,groupId)
        if(!group) return Promise.reject(errors.NOT_FOUND('Group'))
        return await data.transformGroup(group) 
    }

    async function addMovie(token, groupId, movieId){ 
        if(!movieId) return Promise.reject(errors.INVALID_TEXT('Movie Id'))
        token = await getToken(token)
        let user = await getUserByToken(token)
        let group = await data.getGroup(user.id,groupId)
        let movie = await moviesdata.getMovieById(movieId)
        if(!movie.title) return Promise.reject(errors.NOT_FOUND('Movie'))
        movie = {id : movie.id, title : movie.title, plot : movie.plot, duration : +movie.runtimeMins}
        await data.addMovie(movie)
        await data.addMovieToGroup(group,movie)
        
        return movie
    }

    async function deleteMovie(token, groupId, movieId){
        token = await getToken(token)
        let user = await getUserByToken(token)
        let group = await data.getGroup(user.id, groupId)
        let transformed = await data.transformGroup(group)
        let movie = data.findMovieInGroup(transformed,movieId)
        if(!movie) return Promise.reject(errors.NOT_FOUND('Movie'))
        return await data.deleteMovie(group, movie)
    }

    async function getAllGroups() { // test only
        return await data.getAllGroups()
    }

    async function getTopMovies(limit) { 
        if (!limit) limit = 250
        let movies = await moviesdata.getTopMovies()
        return movies.items.slice(0,limit)
    }

    async function getMovie(limit, name) { 
        if (!limit) limit = 250
        if(!name) return Promise.reject(errors.INVALID_TEXT('name'))
        let movies = await moviesdata.getMovieByName(name)
        if(!movies.results) return Promise.reject('IMDB Server Busy')
        movies = movies.results.map(it => ({id : it.id, title : it.title}) )
        return movies.slice(0,limit)
    }

    async function getFavoriteMovies(token){ //get list of all groups from a user   
        token = await getToken(token)
        let user = await getUserByToken(token)
        return await data.getFavoriteMovies(user.id)
    }

    async function editFavoriteMovies(token, groupId, name, description){
        if(!name) return Promise.reject(errors.INVALID_TEXT('name'))
        if(!description) return Promise.reject(errors.INVALID_TEXT('description'))
        let group = await getGroup(token, groupId) 
        return await data.editFavoriteMovies(group, name, description)
    }

    async function deleteGroup(token,groupId){ 
        let group = await getGroup(token, groupId)
        return await data.deleteGroup(groupId)
    }

//Auxiliary functions
    function getToken(token) {
        if(!(token && token.startsWith("Bearer "))) return Promise.reject(errors.NOT_AUTHORIZE(`Invalid Token!!`))
        return Promise.resolve(token.split(" ")[1])
    }
     
    async function getUserByToken(token){
        let user = await data.getUserByToken(token)
        if(!user) return Promise.reject(errors.NOT_FOUND('User'))
        return Promise.resolve(user)
    }

return{
    createUser : createUser,
    validateUser: validateUser,
    createGroup : createGroup,
    getAllUsers : getAllUsers,
    getGroup : getGroup,
    addMovie : addMovie,
    deleteMovie : deleteMovie,
    getAllGroups : getAllGroups,
    getTopMovies : getTopMovies,
    getMovie : getMovie,
    getFavoriteMovies : getFavoriteMovies,
    editFavoriteMovies : editFavoriteMovies,
    deleteGroup : deleteGroup    
}
}