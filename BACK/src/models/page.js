const mongoose = require('mongoose')

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    details: {
        type: String,
        trim: true
    },
    category: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        //ref is an ability of mongoose to reference to something (in this case the User model)
        ref: 'User'
    },
    pageTag: {
        type: String,
        required: true
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    }
    },   
    {
        timestamps: true
    })

const Page = new mongoose.model('Page', pageSchema)

module.exports = Page