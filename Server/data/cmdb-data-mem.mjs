export const users = []
export const groups = []
export const movies = []

let userId = 0
let groupId = 0

export function createUser(name,pass,token) {
    let user = {userName : name,password : pass, id : userId++, token : token}
    users.push(user)
    return Promise.resolve(user)
}

export function createGroup(idUser,name,description) {
    let group = {id: groupId++, 
        idUser: idUser, 
        name : name, 
        description : description, 
        totalduration: 0, 
        movies : []
    }
    groups.push(group)
    return Promise.resolve(group)
}

export function getUserByToken(token) { 
    return Promise.resolve(users.find(u => u.token == token))
}

export function getUserbyNameAndPass(name,pass){
    return users.find(it => it.userName == name && it.password == pass)
}

export function getAllUsers() {   //tests only
    return Promise.resolve(users)
}

export function getAllGroups() {  //tests only
    return Promise.resolve(groups)
}

export function getGroup(userID,groupId){ 
    return Promise.resolve(groups.find(it => it.id == groupId && it.idUser == userID))
}

export function addMovieToGroup(group,movie){
    if(!group.movies.find(it => it.id == movie.id)){
        group.movies.push(movie.id)
        group.totalduration += movie.duration
    }
    return Promise.resolve(movie)
}

export function addMovie(movie){
    if(!movies.find(it => it.id == movie.id)){
        movies.push(movie)
    }
    return Promise.resolve(movie)
}

export function deleteMovie(group, movie){
    const idx = group.movies.findIndex(it => it == movie)
    group.movies.splice(idx, 1)
    group.totalduration -= movie.duration
    return Promise.resolve(movie)
}

export function getFavoriteMovies(idUser){
    let favMovies = groups.filter(it => it.idUser == idUser)
    return Promise.resolve(favMovies)
}

export function editFavoriteMovies(group, newName, newDescription){
    const idx = groups.findIndex(it => it == group)
    groups[idx].name = newName
    groups[idx].description = newDescription
    return Promise.resolve(groups[idx])
}

export function deleteGroup(groupId){
    const idx = groups.findIndex(it => it.id == groupId)
    groups.splice(idx,1)
    return Promise.resolve(groupId)
}    

export function transformGroup(group) {
    for(let i = 0; i < group.movies.length ;i++){ // trocar para allMovies.find 
        for(let j = 0; j < movies.length; j++ ){
            if(group.movies[i] == movies[j].id){
                group.movies[i] = { 
                    "id" : movies[j].id,
                    "title" : movies[j].title,
                    "plot" : movies[j].plot,
                    "duration" : movies[j].duration
                }
            }
        }
    }
    return group
}

export function findGroup(userID,name){
    return groups.filter(it => it.idUser == userID && it.name == name).length > 0
}

export function findMovieInGroup(group,movieId){
    return group.movies.find(it => it.id == movieId)
}