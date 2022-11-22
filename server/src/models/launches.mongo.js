const mongoose = require('mongoose')
const launchSchema  =  mongoose.Schema({
    flightNumber :{ 
        type: Number,
        required: true
    },
    target : {
        type: String,
        required : true 
    },
    launchDate:{ 
        type: Date,
        required: true
    },
    mission:{ 
        type: String,
        required: true
    },
    customer: [String],
    rocket:{ 
        type: String,
        required: true
    },
    upcoming: {
        type : Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    }
    
})
module.exports = mongoose.model('Launch', launchSchema)
