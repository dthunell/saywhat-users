import { HandlerFunction } from 'lambda-api'
import { getUser } from '../lib/userStore'
import { SayWhatError } from '../lib/error'

export const showUser: HandlerFunction = async (req, res) => {
  try {
    const user = await getUser(req.params.username)
    user.passwordHash = undefined
    return res.json(user) // TODO: map to JSONHAL ?
  } catch (error) {
    if (error instanceof SayWhatError) {
      return res.status(error.statusCode).json({ errorMessage: error.message })  
    }
    return res.status(500).json({ errorMessage: error.message || error })
  }
}
