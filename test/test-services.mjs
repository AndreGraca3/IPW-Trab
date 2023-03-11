import {expect} from 'chai';
import servicesFunc from '../Server/services/cmdb-services.mjs'
import * as data from '../Server/data/cmdb-data-mem.mjs'
import * as dataMovies from '../Server/data/cmdb-movies-data.mjs'

const services = servicesFunc(data,dataMovies)

describe('Services Tests', () => {

    const badMovieId = " tt213131231"
    const goodMovieId = "tt1375666"

    const DummyToken = "Bearer dasdsad-sdasd-sadsa"
    const userName = "Danilo"
    const password = "123"
    const groupName = "group1"
    const groupDescription = "description1"
    const DummyId = 1 

    it('Create new user',async() => { 
        let nextIndex = data.users.length 
        let user = await services.createUser(userName,password)
        expect(user.userName).deep.equal(userName)
        expect(user.token).deep.equal(data.users[nextIndex].token)

        data.users.splice(0)  
    })

    it('Create a new group',async() => {
        let nextIndex = data.groups.length
        let user = await services.createUser(userName, password)
        let group = await services.createGroup(`Bearer ${user.token}`,groupName,groupDescription)
        expect(data.groups[nextIndex].name).deep.equal(groupName)
        expect(data.groups[nextIndex].description).deep.equal(groupDescription)
        expect(group).deep.equal(data.groups[nextIndex])

        data.users.splice(0)
        data.groups.splice(0)
    })

    it('Creating a group with invalid user!',async() => {
        let oldgroups = data.groups
        try{
            await services.createGroup(null,groupName,groupDescription)
        }
        catch(msg){
            expect(msg.error).deep.equal('Invalid Token!!')//tentar aceder às mensagens
        }
        expect(data.groups).deep.equal(oldgroups)
        data.users.splice(0)
        data.groups.splice(0)
    })

    it('Creating a group without a name',async() => {
        let token = await services.createUser(userName, password)
        let oldgroups = data.groups
        try{
            await services.createGroup(token,null,groupDescription)
        }
        catch(msg){
            expect(msg.error).deep.equal('Enter a valid Name!!')
        }
        expect(data.groups).deep.equal(oldgroups)
        data.users.splice(0)
        data.groups.splice(0)
    })

    it('Create a group whithout a description',async() => {
        let token = await services.createUser(userName, password)
        let oldgroups = data.groups
        try{
            await services.createGroup(token,groupName,null)
        }
        catch(msg){
            expect(msg.error).deep.equal('Enter a valid Description!!')
        }
        expect(data.groups).deep.equal(oldgroups)
        data.users.splice(0)
        data.groups.splice(0)
    })

    it('Get a group of an invalid user',async() =>{
        let oldgroups = data.groups
        try{
            await services.getGroup(DummyToken,DummyId) // doesn't matter the group id, because the 1st error                                                  // is not having a valid token.
        }
        catch(msg){
            expect(msg.error).deep.equal('User not Found!!')
        }
        expect(data.groups).deep.equal(oldgroups)
        data.groups.splice(0)
    })

    it('Get a non-existing group from a valid user',async() => {
        let user = await services.createUser(userName, password)
        try{
            await services.getGroup(`Bearer ${user.token}`,DummyId)
        }
        catch(msg){
            expect(msg.error).deep.equal('Group not Found!!')
        }
        data.users.splice(0)
    })

    it('Get a valid group',async() =>{
        let nextIndex = data.groups.length
        let user = await services.createUser(userName, password)
        await services.createGroup(`Bearer ${user.token}`,groupName,groupDescription)
        let getGroup = await services.getGroup(`Bearer ${user.token}`,data.groups[nextIndex].id)
        expect(getGroup).deep.equal(data.groups[nextIndex])

        data.users.splice(0)
        data.groups.splice(0)
    })

    it('add movie with a invalid token',async() =>{
        let oldgroups = data.groups
        try{
            await services.addMovie(null,DummyId,goodMovieId)
        }
        catch(msg){
            expect(msg.error).deep.equal('Invalid Token!!')
        }
        expect(data.groups).deep.equal(oldgroups)
    })

    it('add movie in a non-existing group',async() => {
        let user = await services.createUser(userName, password)
        let oldgroups = data.groups
        try{
            await services.addMovie(`Bearer ${user.token}`,DummyId,goodMovieId)
        }
        catch(msg){
            expect(msg.error).deep.equal(undefined)
        }
        expect(data.groups).deep.equal(oldgroups)

        data.users.splice(0)
    })

    it('add a bad movie in a valid group from a valid user',async() =>{
        let nextIndex = data.groups.length
        let user = await services.createUser(userName, password)
        await services.createGroup(`Bearer ${user.token}`,groupName,groupDescription)
        try{
            await services.addMovie(`Bearer ${user.token}`,data.groups[nextIndex].id,badMovieId)
        }
        catch(msg){
            expect(msg.error).deep.equal('Movie not Found!!')//Not a valid movie id!!
        }
        
        expect(data.groups[nextIndex].movies).deep.equal([])

        data.users.splice(0)
        data.groups.splice(0)
    })

    it('add a good movie in a valid group from a valid user',async() =>{
        let nextIndexgroups = data.groups.length
        let user = await services.createUser(userName, password)
        await services.createGroup(`Bearer ${user.token}`,groupName,groupDescription)
        let movie = await services.addMovie(`Bearer ${user.token}`,data.groups[nextIndexgroups].id,goodMovieId)

        expect(movie.id).deep.equal(data.groups[nextIndexgroups].movies[0]) // first movie in this movies
        data.users.splice(0)
        data.groups.splice(0)
    })

    it('deleting a non-existing movie',async() =>{
        let nextIndex = data.groups.length
        let user = await services.createUser(userName, password)
        await services.createGroup(`Bearer ${user.token}`,groupName,groupDescription)
        try{
        await services.deleteMovie(`Bearer ${user.token}`,data.groups[nextIndex].id,goodMovieId)//doesn't matter
            // the movie id because, it should return the error that there is not a movie in the group.
        }
        catch(msg){
            expect(msg.error).deep.equal('Movie not Found!!')
        }
        
        data.users.splice(0)
        data.groups.splice(0)
    })

    it('deleting an existing movie',async() =>{
        let nextIndex = data.groups.length
        let user = await services.createUser(userName, password)
        await services.createGroup(`Bearer ${user.token}`,groupName,groupDescription)
        let movie = await services.addMovie(`Bearer ${user.token}`,data.groups[nextIndex].id,goodMovieId)

        let deleted = await services.deleteMovie(`Bearer ${user.token}`,data.groups[nextIndex].id,goodMovieId)//doesn't matter
        
        expect(deleted).deep.equal(movie)
        expect(data.groups[nextIndex].movies).deep.equal([])
        
        data.users.splice(0)
        data.groups.splice(0)
    })

    it('get a list of all groups from a given user',async() =>{
        let nextIndex = data.groups.length
        let user = await services.createUser(userName, password)
        let group1 = await services.createGroup(`Bearer ${user.token}`,'bestMovies','SpiderMan better than avatar' )
        
        expect(group1).deep.equal(data.groups[nextIndex])

        nextIndex += 1 
        let group2 = await services.createGroup(`Bearer ${user.token}`,'bestMovies2','Top Gun is a 10/10 movie' )

        expect(group2).deep.equal(data.groups[nextIndex]) 

        data.users.splice(0)
        data.groups.splice(0)
    })

    it('editing an existing group',async() => {
        let user = await services.createUser(userName, password)
        let group = await services.createGroup(`Bearer ${user.token}`, groupName, groupDescription)
        let newGroup = await services.editFavoriteMovies(`Bearer ${user.token}`, group.id, 'new name', 'new description')
        expect(newGroup.name).deep.equal('new name')
        expect(newGroup.description).deep.equal('new description')

        data.users.splice(0)
        data.groups.splice(0)
    })

    it('editing a non-existing group',async() =>{
        let nextIndex = data.users.length
        let user = await services.createUser(userName, password)
        try{
        await services.editFavoriteMovies(`Bearer ${user.token}`, DummyId, 'new name', 'new description')
        }
        catch(msg){
            expect(msg.error).deep.equal('Group not Found!!')
        }  
        data.users.splice(0)
        data.groups.splice(0)
    })

    it('deleting an existing group',async() =>{
        let oldgroups = data.groups
        let user = await services.createUser(userName, password)
        let group = await services.createGroup(`Bearer ${user.token}`,'bestMovies','SpiderMan better than avatar' )


        let idDeleted = await services.deleteGroup(`Bearer ${user.token}`,group.id)

        expect(data.groups).deep.equal(oldgroups)
        expect(idDeleted).deep.equal(group.id)
        data.users.splice(0)
        data.groups.splice(0)
    })

    it('deleting an non-existing group',async() =>{
        let user = await services.createUser(userName, password)
        try{
            let groupDeleted = await services.deleteGroup(`Bearer ${user.token}`, DummyId)
        }
        catch(msg) {
            expect(msg.error).deep.equal('Group not Found!!')
        }
    })

});