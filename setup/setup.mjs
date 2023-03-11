import fetch from 'node-fetch'

async function createGroupsElastic(){
    return fetch(URL + `groups`,{ // note to self: must be lowercase.
        method : "PUT", // para criar um indice tem de ser um PUT 
        headers : {
        "Content-Type" : "application/json", 
        "Accept" : "application/json"
    }
    })
}

async function createUsersElastic(){
    return fetch(URL + `users`, {
        method : "PUT",
        headers : {
            "Content-Type" : "application/json", 
            "Accept" : "application/json"
        }
        })
}

async function createMoviesElastic(){
    return fetch(URL + `movies`,{
        method : "PUT",
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json" 
        }
    })
}

async function setup(){
    await createUsersElastic()
    await createGroupsElastic()
    await createMoviesElastic()
}

setup()