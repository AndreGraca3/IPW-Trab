import {convertToHttpError} from '../../errors/http-errors.mjs'

const token = 'Bearer 123'   //login not implemented yet

export default function(services) {

    return {
        getNewUserForm,
        createUser,
        getMyGroups,
        getNewGroupForm,
        getEditGroupForm,
        getHome,
        deleteGroup,
        getDetails,
        addMovie,
        deleteMovie,
        getTopMoviesForm,
        getTopMovies,
        searchMovieForm,
        searchMovie,
        getLoginForm,
        handleError
    }

    function getHome(req, rsp) {
        rsp.render('home', {title : "Home", user : req.user})
    }

    function getNewUserForm(req, rsp) {
        rsp.render('userForm', {title : "Create User", user: req.user, link : '/site/user'})
    }

    async function createUser(req, rsp) {
        try {
        let user = await services.createUser(req.body.username,req.body.password)
        rsp.redirect('/site')
        } catch(e) {
            console.log(e)
            rsp.redirect('/site/error')
        }
    }

    function getNewGroupForm(req, rsp) {
        try {
            rsp.render('groupForm', {title : "Create Group", user: req.user, link : '/api/favoriteMovies', method : 'POST'})
        } catch(e) {
            console.log(e)
            rsp.redirect('/site/error')
        }
    }

    async function getEditGroupForm(req,rsp) {
        try{
            let group = await services.getGroup(req.user.token,req.params.id)
            rsp.render('groupForm',{title : "Edit Group", group, user: req.user, link : '/api/favoriteMovies/', method:'PUT'})
        }catch(e){
            console.log(e)
            rsp.redirect('/site')
        }
    }

    async function deleteGroup(req,rsp){
        try{
            await services.deleteGroup(req.user.token,req.params.id)
            rsp.redirect('/site/groups')
        }catch(e){
            console.log(e)
            rsp.redirect('/site')
        }
    }

    async function getMyGroups(req, rsp) {
        let groups = await services.getFavoriteMovies(req.user.token)
        rsp.render('groups', {title : "My Groups", user: req.user, groups})
    }

    async function getDetails(req,rsp){
        try{
            let group = await services.getGroup(req.user.token,req.params.id)
            rsp.render('group',{title : group.name, user: req.user, group})
        }catch(e){
            console.log(e)
            rsp.redirect('/site/error')
        }
    }

    async function addMovie(req,rsp){
        try{
            await services.addMovie(req.user.token, req.params.groupId, req.body.movieId)
            rsp.redirect(`/site/group/${req.params.groupId}`)
        }catch(e){
            console.log(e)
            rsp.redirect('/site')
        }
    }

    async function deleteMovie(req,rsp){
        try{
            await services.deleteMovie(req.user.token, req.params.groupId, req.params.movieId)
            rsp.redirect(`/site/group/${req.params.groupId}`)
        }catch(e){
            console.log(e)
            rsp.redirect('/site')
        }
    }

    async function getTopMoviesForm(req,rsp) {
        try{
            rsp.render('topMoviesForm',{title : "Get Top Movies", user: req.user, link : `/site/top/limit`})
        }catch(e){
            console.log(e)
            rsp.redirect('/site')
        }
    }

    async function getTopMovies(req, rsp) {
        try{
            let movies = await services.getTopMovies(req.body.limit)            
            rsp.render('topMovies', {title : 'Top Movies', user: req.user, movies : movies})
        } catch(e) {
            console.log(e)
            rsp.redirect('/site')
        }
    }

    async function searchMovieForm(req,rsp) {
        try{
            rsp.render('searchMovieForm',{title : "Search Movie", user: req.user, link : `/site/movie`})
        }catch(e){
            console.log(e)
            rsp.redirect('/site')
        }
    }

    async function searchMovie(req, rsp) {
        try{
            let groups
            if(req.user) groups = await services.getFavoriteMovies(req.user.token)
            let movies = await services.getMovie(req.body.limit, req.body.name)
            rsp.render('searchMovie', {title : 'Search Movie', user: req.user, movies : movies, groups})
        } catch(e) {
            console.log(e)
            rsp.redirect('/site')
        }
    }

    async function handleError(req, rsp) {
        try{
            rsp.render('error', {title : 'Search Movie'})
        } catch(e) {
            console.log(e)
            rsp.redirect('/site')
        }
    }

    async function getLoginForm(req, rsp) {
        try {
            rsp.render('userForm', {title: "Login", link : "/site/login"})
        } catch(e) {
            console.log(e)
            rsp.redirect('/site')
        }
    }

}