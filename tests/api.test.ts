import { handler } from '../src/api'
import { hashPassword } from '../src/lib/userHelpers'
import { createEvent } from './utils/createEvent'
import { deleteAllItems, createTableIfNotExists, insertItem, countItems } from './utils/dynamoDb'

const USER_ONE = {
 username: 'a',
 password: 'a',
 passwordHash: hashPassword('a')
}

const USER_TWO = {
  username: 'b',
  password: 'b',
  passwordHash: hashPassword('b')
}

describe('Saywhat - Users', () => {
  beforeAll(async () => {
    await createTableIfNotExists()
    await insertItem(USER_ONE)
    await insertItem(USER_TWO)
  })

  afterEach(async () => {
    await deleteAllItems()
  })

  describe('Create user', () => {
    it('should not be able to create user without username', async () => {
      const itemsBefore = await countItems()
      const body = {
        password: 'pwd'
      }
      const event = createEvent('POST', '/users', undefined, body)
      const { statusCode } = await handler(event)
      const itemsAfter = await countItems()
      expect(statusCode).toBe(200)
      expect(itemsBefore).toEqual(itemsAfter)
    })

    // it('should not be able to create user without password', () => {})
    // it('should be able to create user', () => {})
    // it('should not be able to create user twice', () => {})
  })

  // describe('Login user', () => {})

  // describe('List users', () => {})

  // describe('Show user', () => {})

  // describe('Update user', () => {})

  // it("should return ok", async () => {
  //   const { body, statusCode } = await handler(event)
  //   const { status } = JSON.parse(body)
  //   expect(statusCode).toBe(200)
  //   expect(status).toEqual('ok')
  // })
})