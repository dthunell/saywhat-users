import { createHmac } from 'crypto'
import { User } from '../types/User'

const { PASSWORD_SALT } = process.env

export const isUser = (user: any): user is User => {
  return user.username !== undefined &&
    user.passwordHash !== undefined &&
    user.email !== undefined
}

export const mapUser = (user: any): User => { 
  // Pluck all known properties - must be kept in sync with User.d.ts and Dynamo schema
  return {
    username: user.username,
    passwordHash: user.passwordHash,
    email: user.email,
    name: user.name,
    imageUrl: user.imageUrl,
    active: user.active
  }
}

export const hashPassword = (password: string): string => {
  return createHmac('sha256', PASSWORD_SALT)
    .update(password)
    .digest('hex')
}