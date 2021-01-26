
import express from 'express'
import Gun from 'gun'

const server = express()
    .use('/components', express.static('components'))
    .use(express.static('static'))
    .use(Gun.serve)
    .listen(3000)

Gun({web: server})