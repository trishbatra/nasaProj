const axios = require('axios')
let latestFlighNumber = 100
const launchModel  = require('./launches.mongo')
const planetModel  = require('./planets.mongo')

async function existLaunchWithId(launchId) {
    // return launches.has(launchId)
    return await findLaunch({
        flightNumber: launchId
    })
}

async function getAllLaunches(skip, limit){
    return await launchModel.find({},{ '_id': 0, '__v': 0}).sort({
        flightNumber: 1
    }).skip(skip).limit(limit)
    // return Array.from(launches.values())
}

const DEFAULT_FLIGHT_NUMBER = 100
async function getLatestFlightNumber(){
    const latestLaunch = await launchModel.findOne().sort('-flightNumber')
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER
    }
    console.log(latestLaunch.flightNumber)
    return latestLaunch.flightNumber
}
async function scheduleNewLaunch(launch) {
    let planet = await planetModel.findOneAndUpdate({
        keplerName: launch.target
    })
    if(!planet){
        throw new Error(`BRUHHHHHHHHH`)
    }
    const newFlightNumber = await getLatestFlightNumber() +1
    const newLaunch = Object.assign(launch,{
        flightNumber: newFlightNumber,
        success: true,
        upcoming: true,
        customers: ["trishTheNalla", "Bruh"]
    })
    await setLaunches(newLaunch)
}
async function findLaunch(launchToFind){
    return await launchModel.findOne(launchToFind)
}

const SPACEX_URL = 'https://api.spacexdata.com/v5/launches/query'
async function populateDatabase(){
        // console.log('loading launch data')
        const responseFromSpaceXApi = await axios.post(SPACEX_URL,{
            query: {},
            options: {
              pagination: false,
              populate: [
                {
                  path: 'rocket',
                  select: {
                    name: 1
                  }
                },
                {
                  path: 'payloads',
                  select: {
                    'customers': 1
                  }
                }
              ]
            }
          })
        if(responseFromSpaceXApi.status != 200){
            console.log(`  problem in loading data `)
        }
        const ourRespnse = responseFromSpaceXApi.data.docs
        for( let doc of ourRespnse ){
            let payLoad = doc['payloads']
            let customers = payLoad.map(( payload )=>{
                return payload['customers']
            })
            const launchDoc = {
                flightNumber: doc['flight_number'],
                mission : doc['name'],
                rocket : doc['rocket']['name'],
                launchDate: doc['date_local'],
                upcoming: doc['upcoming'],
                success: doc['success'],
                customers: doc['customers']
            }
            // getStuff(launchDoc)
            await setLaunches(launchDoc)
            // console.log(`${launchDoc.flightNumber}`)

        }
}

async function loadSpaceXData(){
    const firstLaunch = await findLaunch({
        flight_number: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })
    if(firstLaunch){
        console.log(`Data has been loaded`)
    }else{
        await populateDatabase()
    }
}
async function setLaunches(launch){
    await launchModel.updateOne({
        flightNumber: launch.flightNumber
    },
        launch
    , {upsert: true})
}
// setLaunches(launch)
// launches.set( launch.flightNumber, launch)
async function abortLaunchById(launchId) {
     const aborted = await launchModel.updateOne({
        flightNumber: launchId
    },{
        success: false,
        upcoming: false
    })
    return  aborted.modifiedCount == 1 
}
module.exports = {
    getAllLaunches,
    existLaunchWithId,
    abortLaunchById,
    scheduleNewLaunch,
    loadSpaceXData
}