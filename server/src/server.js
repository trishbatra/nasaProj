const http = require('http')
require('dotenv').config()
const { app } = require('./app')
const { loadPlanetData } = require('./models/planets.models')
const { loadSpaceXData } = require('./models/launches.model')
const { mongoConnect } = require('../services/mongo')
const server = http.createServer(app)
let PORT =  8000
// console.log(process.env.PORT)


async function startServer(){
    await mongoConnect()
    await loadPlanetData()
    await loadSpaceXData()
    server.listen(PORT, ()=>{
        console.log(`lisening on port ${PORT}`)
    })
}
startServer()
// console.log(PORT);