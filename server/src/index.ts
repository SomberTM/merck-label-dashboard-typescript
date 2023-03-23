import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import prisma from './db'

import sampleRouter from './routes/samples'
import teamsRouter from './routes/teams'
import teamsFieldsRouter from './routes/teams_fields'
import teamsLabelsRouter from './routes/teams_labels'
import printersRouter from './routes/printers'
import { getDeletedSamples } from './controllers/samples'

;(async function () {
    const app: express.Express = express()
    const port = 7777

    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(cors())

    // ----------------------------------------------
    // NEW ROUTES :>)

    app.use('/samples', sampleRouter)

    app.get('/deleted_samples', getDeletedSamples)

    app.use('/fields', teamsFieldsRouter)

    app.use('/labels', teamsLabelsRouter)

    app.use('/teams', teamsRouter)

    app.use('/printers', printersRouter)

    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })

    prisma.$disconnect()
})()
