import dotenv from 'dotenv'
dotenv.config()


type EnvType = 'development' | 'production'
export const env:EnvType = process.env.NODE_ENV as EnvType || 'production'

