import address from './address'
import express from 'express'
const router = express.Router()

router.use('/address', address)

export default router