const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(bodyParser.json())

const mongoUrl = 'mongodb://fullstack:kurssi@ds235827.mlab.com:35827/blogilista'
mongoose.connect(mongoUrl)
mongoose.Promise = global.Promise

app.use(middleware.logger)
app.use('/app/blogs', blogsRouter)
app.use(middleware.error)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
