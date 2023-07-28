const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
    {
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Message', messageSchema)