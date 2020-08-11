import api from '../routes'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('common'))
app.use(compression())
app.use(helmet())
app.use('/api', api)


export default app