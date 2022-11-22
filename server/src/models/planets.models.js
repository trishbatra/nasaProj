const { rejects } = require('assert');
const {parse} = require('csv-parse');
const fs = require('fs');
const { resolve } = require('path');
const { launches } = require('./launches.model');
const planet = require('./planets.mongo' )
// const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}
async function getAllPlanets(){
    return await planet.find({}, {
        '_id': 0, '__v': 0
    })
}
async function savePlanet(planett){
    try{
        await planet.updateOne({
                keplerName: planett.kepler_name 
            },{
                keplerName : planett.kepler_name
            },{
                upsert: true
            })
    }catch(err){
        console.log(`could not save the planet ${err}`)
    }
    
}

function loadPlanetData(){
    return new Promise((resolve, reject)=>{
        fs.createReadStream('../../nasa/data/kepler_data.csv')
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)) {
                savePlanet(data)
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err)
        })
        .on('end', async () => {
            let planetCount = await (getAllPlanets()).length 
            console.log(`${planetCount} habitable planets found!`);
            resolve()
        });

    })
}

module.exports = {
    loadPlanetData,
    // planets: habitablePlanets
    getAllPlanets
}
