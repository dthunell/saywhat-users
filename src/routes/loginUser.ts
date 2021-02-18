import { HandlerFunction } from 'lambda-api'
import * as jwt from 'jsonwebtoken'
import { getUser } from '../lib/userStore'
import { SayWhatError } from '../lib/error'
import { hashPassword } from '../lib/userHelpers'

const { JWT_SECRET } = process.env

export const loginUser: HandlerFunction = async (req, res) => {
  try {
    if (!req.body.password) {
      throw new SayWhatError('You need to provide your password', 400)
    }

    if (!req.body.username) {
      throw new SayWhatError('You need to provide your old username', 400)
    }

    const user = await getUser(req.body.username)

    if (user.passwordHash !== hashPassword(req.body.password)) {
      throw new SayWhatError('Password is incorrect', 400)
    }

    const token = jwt.sign({ username: req.body.username }, JWT_SECRET, { expiresIn: '7d' })

    return res.status(200).json({ token })  
  } catch (error) {
    if (error instanceof SayWhatError) {
      return res.status(error.statusCode).json({ errorMessage: error.message })  
    }
    return res.status(500).json({ errorMessage: error.message || error })
  }
}
