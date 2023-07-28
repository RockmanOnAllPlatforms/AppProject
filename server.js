const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const { errorHandle } = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const PORT = process.env.PORT || 3000

app.use(logger)

app.use(cors())

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message : '404: Not found'})
    } else {
        res.type('txt').send('404: Not found')
    }
})

app.use(errorHandle)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))