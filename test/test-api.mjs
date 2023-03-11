import express from 'express'
import { expect } from 'chai';
import request from 'supertest';
import appFunctions from '../Server/cmdb-server.mjs'
import * as data from '../Server/data/cmdb-data-mem.mjs'

describe('API tests', () => {

  let token = ""
  let groupId
  let idUser
  let movieId = "tt0111161"
  
  it("testing moviesPopular", async () => { 
      const result = await request(appFunctions.app)
        .get('/api/moviesPopular')
        .query({ limit: 5 })
        .expect('Content-Type', /json/)
        .expect(200)
  
        appFunctions.appServer.close() // this makes that the test's stop executing once finished
        
        expect(result.body.length).deep.equal(5)
    });

    it("testing movie",async () => {
      let movieName = "Shrek"
      const result = await request(appFunctions.app)
        .get('/api/movie/' + movieName )
        .expect('Content-Type',/json/)
        .expect(200)

      appFunctions.appServer.close()

      expect(result.body.length > 0).deep.equal(true)
    });

    it("testing creating a user",async () => {
      const result = await request(appFunctions.app)
      .post('/api/user')
      .send({
        name : "Andre",
        password:"borracha"
      })
      .expect(201)
      
      appFunctions.appServer.close()
      
      expect(result.body != null).deep.equal(true)
      token = 'Bearer ' + result.body.token
      idUser = result.body.id
    });
   
    it("testing creating a group",async () =>{
      let result = await request(appFunctions.app)
      .post('/api/favoriteMovies')
      .set('authorization',token)
      .send({
        name : "Filmes de comédia",
        description : "Os filmes de comédia mais engraçados."
      })
      .expect(201)

      appFunctions.appServer.close()

      groupId = result.body.id
      expect(result.body).deep.equal({id:0,idUser:0, name : "Filmes de comédia",
      description : "Os filmes de comédia mais engraçados.", movies : [], totalduration:0})

    });

    it("testing group details",async () =>{
      const result = await request(appFunctions.app)
      .get('/api/favoriteMovies/' + groupId)
      .set('authorization',token)
      .expect('Content-type',/json/)
      .expect(200)

      appFunctions.appServer.close()

      expect(result.body.id).deep.equal(groupId)
    });
    
    it("testing get all groups from a user",async() => {
      const result = await request(appFunctions.app)
      .get('/api/favoriteMovies')
      .set('authorization',token)
      .expect('Content-type',/json/)
      .expect(200)

      appFunctions.appServer.close()

      expect(result.body.filter(it => it.idUser == idUser)).deep.equal(result.body)
    });

    it("testing editing a group ",async () =>{
      await request(appFunctions.app)
      .put('/api/favoriteMovies/' + groupId)
      .set('authorization',token)
      .send({
        name : "Filmes de comédia",
        description : "Os filmes de comédia mais engraçados."
      })
      .expect(204)

      appFunctions.appServer.close()

    })

    it("testing adding a movie", async () =>{
      let result = await request(appFunctions.app)
      .put('/api/favoriteMovies/'+ groupId + '/movies/' + movieId)
      .set('authorization',token)
      .expect(201)

      appFunctions.appServer.close()

      expect(result.body).deep.equal("Movie added successfully!")
    })

    it("testing deleting a movie", async () =>{
      let result = await request(appFunctions.app)
      .delete('/api/favoriteMovies/'+ groupId + '/movies/' + movieId)
      .set('authorization',token)
      .expect(200)

      appFunctions.appServer.close()

      expect(result.body).deep.equal("Movie deleted successfully!")
    })

    it("testing deleting a group",async () =>{
      let result = await request(appFunctions.app)
      .delete('/api/favoriteMovies/' + groupId)
      .set('authorization',token)
      .expect(200)
      appFunctions.appServer.close()

      expect(result.body).deep.equal("Group deleted successfully!")

    });
});