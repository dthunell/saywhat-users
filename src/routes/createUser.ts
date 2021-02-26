import { HandlerFunction } from 'lambda-api'
import { createUser } from '../lib/userStore'
import { SayWhatError } from '../lib/error'
import { hashPassword } from '../lib/userHelpers'

export const createUserHandler: HandlerFunction = async (req, res) => {
  try {
    if (req.body.password) {
      req.body.passwordHash = hashPassword(req.body.password)
    }
    req.body.active = true // New users are active by default

    await createUser(req.body)
    return res.redirect(`/users/${req.body.username}`)
  } catch (error) {
    if (error instanceof SayWhatError) {
      return res.status(error.statusCode).json({ errorMessage: error.message })
    }
    return res.status(500).json({ errorMessage: error.message || error })
  }
}
