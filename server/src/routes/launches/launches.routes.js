const express = require('express')
const { launches } = require('../../models/launches.model')
const { getLaunches, httpAddANewLaunch, httpAbortLaunch } = require('./launches.controller')
const launchesRouter  = express.Router()
launchesRouter.get("/launches", getLaunches)
launchesRouter.post("/launches", httpAddANewLaunch)
launchesRouter.delete('/launches/:id', httpAbortLaunch)
module.exports = {
    launchesRouter
}