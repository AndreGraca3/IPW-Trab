import fetch from 'node-fetch'

const URL = "http://localhost:9200/"
//dataElastic function 
export async function createUser(name, pass,token) { 
        let userId = await getNextUserId()
        const body = {userName : name, password : pass, id : userId, token : token}
        return fetch(URL + `users/_doc/${userId}/?refresh=wait_for`,{
            method : "PUT",
            body : JSON.stringify(body),
            headers : {
                "Content-Type" : "application/json", 
                "Accept" : "application/json"}
            })
}

export async function createGroup(idUser,name,description) {
        let groupId = await getNextgroupId()
        let group = {id : groupId, 
            idUser : idUser, 
            name : name, 
            description : description, 
            totalduration : 0, 
            movies : []
        }
        return fetch(URL + `groups/_doc/${groupId}/?refresh=wait_for`,{
            method : "PUT",
            body : JSON.stringify(group),
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "applicaton/json"
            }
        })
}

export async function getUserByToken(token) {
    let allUsers = await getAllUsers()
    return allUsers.find(u => u.token == token)
}

export async function getGroup(userID,groupId){
    let allGroups = await getAllGroups()
    let groups = allGroups.map(t => t._source)
    let myGroup = groups.find(it => it.id == groupId && it.idUser == userID)
    return myGroup
}

export async function getUserbyNameAndPass(name,pass){
    let users = await getAllUsers()
    return users.find(it => it.userName == name && it.password == pass)
}

export async function transformGroup(group) {
    let movies = await getAllMovies()
    for(let i = 0; i < group.movies.length ;i++){
        for(let j = 0; j < movies.length; j++ ){
            if(group.movies[i] == movies[j]._source.id){
                group.movies[i] = { 
                    "id" : movies[j]._source.id,
                    "title" : movies[j]._source.title,
                    "plot" : movies[j]._source.plot,
                    "duration" : movies[j]._source.duration
                }
            }
        }
    }
    return group
}

export async function addMovieToGroup(group,movie){
    let oldMovies = group.movies
    let duration = group.totalduration
    if(!group.movies.find(it => it == movie.id)){
        oldMovies.push(movie.id)
        duration += movie.duration
    }
    let newGroup = { id : group.id,
        idUser: group.idUser,
        name: group.name,
        description: group.description,
        totalduration: duration,
        movies : oldMovies
    }
    return fetch(URL + `groups/_doc/${group.id}/?refresh=wait_for`,{
        method : "PUT",
        body : JSON.stringify(newGroup),
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "applicaton/json"
        }
    })
}

export async function addMovie(movie){
    let newMovie = { id : movie.id,
        title : movie.title,
        plot : movie.plot,
        duration : movie.duration
    }
    return fetch(URL + `movies/_doc/${movie.id}/?refresh=wait_for`,{
        method : "PUT",
        body : JSON.stringify(newMovie),
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        }
    })

}

export function deleteMovie(group, movie){
    let idx = group.movies.findIndex(it => it.id == movie.id)
    let oldMovies = group.movies
    oldMovies.splice(idx,1)
    oldMovies = oldMovies.map(it => it = it.id)
    let newGroup = { id: group.id,
        idUser : group.idUser,
        name : group.name,
        description : group.description,
        totalduration : group.totalduration -= movie.duration,
        movies : oldMovies
    }
    return fetch(URL + `groups/_doc/${group.id}/?refresh=wait_for`,{
        method : "PUT",
        body : JSON.stringify(newGroup),
        headers : {
            "Content-type" : "application/json",
            "accept" : "application/json"
        }
    })
}

export async function getFavoriteMovies(idUser){
    let allGroups = await getAllGroups()
    let myGroups = allGroups.filter(it => it._source.idUser == idUser)
    return myGroups.map(group => ({id : group._source.id ,name: group._source.name ,
        description: group._source.description,totalduration: group._source.totalduration,
        movies : group._source.movies[0]}))
}

export function editFavoriteMovies(group, newName, newDescription){
    let body = { id : group.id, idUser : group.idUser, name :newName, description : newDescription,
    totalduration : group.totalduration, movies : group.movies}
    return fetch(URL + `groups/_doc/${group.id}/?refresh=wait_for`,{
        method : "PUT",
        body : JSON.stringify(body),
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        }
    })
}

export async function deleteGroup(groupId){ 
    return fetch(URL + `groups/_doc/${groupId}/?refresh=wait_for`,{
        method : "DELETE",
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "applicaton/json"
        }
    })
}    

export async function findGroup(userID,name){
    const groups = await getAllGroups()
    return groups.filter(it => it._source.idUser == userID && it._source.name == name).length > 0
}

export function findMovieInGroup(group,movieId){
    return group.movies.find(it => it.id == movieId)
}

//auxiliary functions/debug functions
export async function getNextUserId(){
    let length = await getUsersLength() 
    let allUsers = await getAllUsers()
    if(length == 0) return length
    let lastId = allUsers[length - 1].id
    return lastId + 1 
}

export function getUsersLength(){
    return fetch(URL + `users/_search`,{
        headers : {
            "Content-type" : "application/json",
            "Accept" : "application/json"
        }
    })
    .then(resp => resp.json())
    .then(resp => resp.hits.hits.length)
}

export async function getNextgroupId(){
    let length = await getGroupsLength()
    let allGroups = await getAllGroups()
    if(length == 0) return length
    let lastId = allGroups[length - 1]._source.id
    return lastId + 1
}

export function getGroupsLength(){
    return fetch(URL + `groups/_search`,{
        headers : {
            "Content-type" : "application/json",
            "Accept" : "application/json"
        }
    })
    .then(resp => resp.json())
    .then(resp => resp.hits.hits.length)
}

export function getAllUsers(){
    return fetch(URL + `users/_search`,{
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "applicaton/json"
        } 
    })
    .then(resp => resp.json())
    .then(resp => resp.hits.hits.map(t => t._source))
}

export function getAllGroups(){
    return fetch(URL + `groups/_search/`,{
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        }
    })
    .then(resp => resp.json())
    .then(resp => resp.hits.hits)
}

export function getAllMovies(){
    return fetch(URL + `movies/_search`,{
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        }
    })
    .then(resp => resp.json())
    .then(resp => resp.hits.hits)
}