import { HandlerFunction } from 'lambda-api'
import { updateUser, changePassword, getUser } from '../lib/userStore'
import { SayWhatError } from '../lib/error'
import { hashPassword } from '../lib/userHelpers'

export const updateUserHandler: HandlerFunction = async (req, res) => {
  try {
    if (req.locals.username !== req.params.username) {
      throw new SayWhatError('You can only modify yourself', 403)
    }

    if (!req.body.password) {
      throw new SayWhatError('You need to provide your old password', 400)
    }

    const user = await getUser(req.locals.username)

    if (user.passwordHash !== hashPassword(req.body.password)) {
      throw new SayWhatError('Old password is incorrect', 400)
    }

    if (req.body.newPassword) {      
      // generate new hash if match - need to set salt in env
      await changePassword(req.locals.username, hashPassword(req.body.newPassword))
    } 

    // update other data
    await updateUser(req.locals.username, req.body)

    return res.redirect(201, `/users/${req.locals.username}`)
  } catch (error) {
    if (error instanceof SayWhatError) {
      return res.status(error.statusCode).json({ errorMessage: error.message })  
    }
    return res.status(500).json({ errorMessage: error.message || error })
  }
}
