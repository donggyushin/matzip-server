import express from 'express'
import {getAddressFromGeoLocation} from '../controllers/address'
const router = express.Router()

router.get('',getAddressFromGeoLocation)

export default router