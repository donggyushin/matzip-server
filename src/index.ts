import app from './app/app'
import dotenv from 'dotenv'
import {env} from './constants/constants'
dotenv.config()
let PORT = process.env.DEV_PORT || '5000'
switch (env) {
  case 'development':
      PORT = process.env.DEV_PORT || '5000'
      break;
    case 'production':
      PORT = process.env.PRD_PORT || '5000'
  default:
    break
}


app.listen(PORT, () => {
  console.log(`✅ Matzip server listening at port ${PORT}`)
})