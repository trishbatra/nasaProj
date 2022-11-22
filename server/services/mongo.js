const mongoose = require('mongoose')
const mongoUrl = process.env.Mongo_URL
mongoose.connection.once('open',()=>{
    console.log("mongo db connection ready" )
})
mongoose.connection.on('error',(err)=>{
    console.error(err )
})
async function mongoConnect(){
    await mongoose.connect(mongoUrl)
}
module.exports = {
    mongoConnect
}