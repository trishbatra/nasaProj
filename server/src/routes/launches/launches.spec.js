const { response } = require('express')
const request = require('supertest')
const { app } = require('../../app')
describe('Test GET /launches', ()=>{
    test('it should respnse with 200 success ', async () => {
      const res = await request(app).get('/planets')
      expect(res.statusCode).toBe(200)
    }) 
})
describe('Test POST /launches', ()=>{
  const theObj = {
    mission: "Nalle trish ko dhundo",
    launchDate: "March 23 2023",
    target: "Nalla trish",
    rocket: "Nalle trish ki fatichar gaddi"
  }
  const theObjNoDate = {
    mission: "Nalle trish ko dhundo",
    // launchDate: "March 23 2023",
    target: "Nalla trish",
    rocket: "Nalle trish ki fatichar gaddi"
  }
    test('should return status 201', async() => {
      const res = await request(app)
      .post('/launches')
      .send({
        mission: "Nalle trish ko dhundo",
        launchDate: "March 23 2023",
        target: "Nalla trish",
        rocket: "Nalle trish ki fatichar gaddi"
      })
      expect(/json/)
      expect(201)
      const requestDate = new Date(theObj.launchDate).valueOf()
      const resDate = new Date(res.body.launchDate).valueOf()
      expect(resDate).toBe(requestDate)
      expect(res.body).toMatchObject( theObjNoDate )
    })
    test('testing for the missing field', async() =>{
      const res = await request(app)
      .post('/launches')
      .send(theObjNoDate)
      expect(404)
    expect( res.body ).toStrictEqual({
      error: "Field not found"
    })

    })
    
})