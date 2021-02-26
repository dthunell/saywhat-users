import { APIGatewayEvent, Context } from 'aws-lambda'
import createAPI from 'lambda-api'
import { Middleware } from 'lambda-api'
import * as jwt from 'jsonwebtoken'
import { createUserHandler } from './routes/createUser'
import { loginUser } from './routes/loginUser'
import { listUsers } from './routes/listUsers'
import { showUser } from './routes/showUser'
import { updateUserHandler } from './routes/updateUser'

const { JWT_SECRET } = process.env
const api = createAPI({ base: process.env.BASEPATH })

const authenticationMiddleware: Middleware = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const decoded: any = jwt.verify(JWT_SECRET, req.headers.authorization)
      req.locals = req.locals || {}
      req.locals.username = decoded.username
      return next()
    }
    return res.status(401).send('Not Authorized')
  } catch (error) {
    console.error('Failed to decode JWT')
    return res.status(401).send('Not Authorized')
  }
}

// Public endpoints
api.post('/', createUserHandler)
api.post('/login', loginUser)

// Protected endpoints
api.get('/', authenticationMiddleware, listUsers)
api.get('/:username', authenticationMiddleware, showUser)
api.put('/:username', authenticationMiddleware, updateUserHandler)

export const handler = async (event: APIGatewayEvent, context?: Context) => {
  return await api.run(event, context)
}
