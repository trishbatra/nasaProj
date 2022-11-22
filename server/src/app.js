const express = require('express')
const path  = require('path')
const cors = require('cors')

const app = express()
const morgan = require('morgan')
const api = require('./routes/api')
app.use(cors({
    origin : 'http://localhost:3000',
}))
app.use(morgan('common'))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))
// app.use(newRouter)
app.use('/v1',api)
app.get('/*', (req, res)=>{
    res.sendFile(path.join(__dirname,'..', 'public', 'index.html'))
})
module.exports = {
    app
}