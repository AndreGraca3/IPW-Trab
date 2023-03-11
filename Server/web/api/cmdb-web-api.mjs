import {convertToHttpError} from '../../errors/http-errors.mjs'


export default function(services){
    function createUser(req,rsp) {
        services.createUser(req.body.name, req.body.password)
        .then(user => rsp.status(201).json(user))
        .catch(err => handleError(err,rsp))
    }

    function createGroup(req, rsp) {
        services.createGroup(req.get("Authorization"), req.body.name, req.body.description)
        .then(group => rsp.status(201).json(group))
        .catch(err => handleError(err,rsp))
    }

    function getAllUsers(req, rsp) {  //tests only
        services.getAllUsers()
        .then(users => rsp.status(200).json(users))
        .catch(err => handleError(err,rsp))
    }

    function getAllGroups(req, rsp) { //tests only
        services.getAllGroups()
        .then(groups => rsp.status(200).json(groups))
        .catch(err => handleError(err,rsp))
    }

    function getTopMovies(req, rsp) {
        services.getTopMovies(req.query.limit)
        .then(movies => rsp.status(200).json(movies))
        .catch(err => handleError(err,rsp))
    }

    function getMovie(req, rsp) {
        services.getMovie(req.query.limit, req.params.name)
        .then(movie => rsp.status(200).json(movie))
        .catch(err => handleError(err,rsp))
    }

    function getGroupDetails(req,rsp){
        services.getGroup(req.get("Authorization"), req.params.groupId)
        .then(group => rsp.status(200).json(group))
        .catch(err => handleError(err,rsp))
    }

    function addMovie(req,rsp){
        services.addMovie(req.get("Authorization"), req.params.groupId, req.params.movieId)
        .then(movie => rsp.status(201).json(`Movie added successfully!`))
        .catch(err => handleError(err,rsp))
    }

    function deleteMovie(req,rsp){
        services.deleteMovie(req.get("Authorization"), req.params.groupId, req.params.movieId)
        .then(idx => rsp.status(200).json(`Movie deleted successfully!`))
        .catch(err => handleError(err,rsp))
    }

    function getFavoriteMovies(req,rsp){    
        services.getFavoriteMovies(req.get("Authorization"))
        .then(movies => rsp.status(200).json(movies))
        .catch(err => handleError(err,rsp))
    }

    function editFavoriteMovies(req,rsp){
        services.editFavoriteMovies(req.get("Authorization"),req.params.groupId,req.body.name, req.body.description)
        .then(group => rsp.status(204).json(`Group edited successfully!`))
        .catch(err => handleError(err,rsp))
    }

    function deleteGroup(req,rsp){
        services.deleteGroup(req.get("Authorization"),req.params.groupId)
        .then(group => rsp.status(200).json(`Group deleted successfully!`))
        .catch(err => handleError(err,rsp))
    }


//Auxiliary Functions
    function handleError(err, rsp) {
        console.log(err)
        err = convertToHttpError(err)
        rsp.status(err.status).json(err.body)
    }

    return{
        createUser : createUser,
        createGroup : createGroup,
        getAllUsers : getAllUsers,
        getAllGroups : getAllGroups,
        getTopMovies : getTopMovies,
        getMovie : getMovie,
        getGroupDetails : getGroupDetails,
        addMovie : addMovie,
        deleteMovie : deleteMovie,
        getFavoriteMovies : getFavoriteMovies,
        editFavoriteMovies : editFavoriteMovies,
        deleteGroup : deleteGroup
    }
}