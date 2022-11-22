const express  = require('express')
const { plnetRouter } = require('./planets/planets.routes')
const { launchesRouter } = require('./launches/launches.routes')
const api  = express.Router()
api.use(plnetRouter)
api.use(launchesRouter)

module.exports = api