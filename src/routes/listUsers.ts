import { HandlerFunction } from 'lambda-api'
import { getUsers } from '../lib/userStore'
import { SayWhatError } from '../lib/error'

export const listUsers: HandlerFunction = async (req, res) => {
  try {
    const users = await getUsers()
    return res.json(users) // TODO: format into JSONHAL?
  } catch (error) {
    if (error instanceof SayWhatError) {
      return res.status(error.statusCode).json({ errorMessage: error.message })  
    }
    return res.status(500).json({ errorMessage: error.message || error })
  }
}
