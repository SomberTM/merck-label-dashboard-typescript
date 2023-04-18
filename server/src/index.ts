import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import prisma from './db'

import samplesRouter from './routes/samples'
;(async function () {
    const app: express.Express = express()
    const port = 7777

    app.use(bodyParser.json({ limit: '1mb' }))
    app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }))
    app.use(cors())

    // ----------------------------------------------
    // NEW ROUTES :>)

    app.use('/samples', samplesRouter)

    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })

    prisma.$disconnect()
})()
