import fetch from 'node-fetch'
const KEY = "k_gxmdncq8"
const KEY2 = "k_fsl3of5t"
const moviesFake = {items: [{id : "tt9313", title : "shaw", plot : "siuu", runtimeMins:  22}, 
{id : "tt3423", title : "nemo", plot : "siuu", runtimeMins:  22}]}


export function getTopMovies() {
    return fetch(`https://imdb-api.com/en/API/Top250Movies/${KEY}`)
    .then(response => response.json())
    .catch(err => Promise.reject(err))
}

export function getMovieById(id){
    return fetch(`https://imdb-api.com/en/API/Title/${KEY}/${id}`)
    .then(response => response.json())
    .catch(err => Promise.reject(err))
}

export function getMovieByName(name){
    return fetch(`https://imdb-api.com/en/API/SearchMovie/${KEY}/${name}`)
    .then(response => response.json())
    .catch(err => Promise.reject(err))
}