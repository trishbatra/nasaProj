const express = require('express')
// const {app} = require('../../app.js')
const { getPlanets } = require('./planets.controller')
const app = express()
const plnetRouter = express.Router()
// const newRouter  = express.Router()
plnetRouter.get("/planets", getPlanets)
module.exports = {
    plnetRouter,
}
