const { getPagination } = require("../../../services/query");
const {getAllLaunches,existLaunchWithId, scheduleNewLaunch, abortLaunchById } = require("../../models/launches.model");

async function getLaunches(req,res){
    console.log(req.query)
    const {skip, limit} = getPagination(req.query)
    const launches = await getAllLaunches(skip, limit) 
    return res.status(200).send(launches)
}
async function httpAddANewLaunch(req, res) {
    let Launch = req.body
    if( !Launch.mission || !Launch.target || !Launch.launchDate || !Launch.rocket ){
            return res.status(400).json({
                error: "Field not found"
            })
    }
    await scheduleNewLaunch(Launch)
    Launch.launchDate = new Date(Launch.launchDate)
    if(isNaN(Launch.launchDate)){
        return res.status(400).json({
            error: "Invalid date"
        })
    }
    return res.status(201).json(Launch)

}
async function httpAbortLaunch(req, res) {
    let launchId = req.params.id
    launchId = Number(launchId)
    const abortedOrNot = await existLaunchWithId(launchId)
    if (!abortedOrNot){
        res.status(400).json({
            error : "Bruh"
    })
    }
    const aborted = await  abortLaunchById(launchId)
    if (!aborted){
        res.status(400).send({
            error: "Bruh it dosent even in the god damm launches collection"
        })
    }
    return res.status(200).json({
        ok: true
    })
}
module.exports = {
    httpAddANewLaunch,
    httpAbortLaunch,
    getLaunches
}