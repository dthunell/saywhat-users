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
  })

  beforeEach(async () => {
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
      const event = createEvent('POST', '/', undefined, body)
      const { statusCode } = await handler(event)
      const itemsAfter = await countItems()
      expect(statusCode).toBe(400)
      expect(itemsBefore).toEqual(itemsAfter)
    })

    it('should not be able to create user without password', async () => {
      const itemsBefore = await countItems()
      const body = {
        username: 'username'
      }
      const event = createEvent('POST', '/', undefined, body)
      const { statusCode } = await handler(event)
      const itemsAfter = await countItems()
      expect(statusCode).toBe(400)
      expect(itemsBefore).toEqual(itemsAfter)
    })

    it('should not be able to create user without email', async () => {
      const itemsBefore = await countItems()
      const body = {
        username: 'username',
        password: 'password'
      }
      const event = createEvent('POST', '/', undefined, body)
      const { statusCode } = await handler(event)
      const itemsAfter = await countItems()
      expect(statusCode).toBe(400)
      expect(itemsBefore).toEqual(itemsAfter)
    })
    
    it('should be able to create user', async () => {
      const itemsBefore = await countItems()
      const now = Date.now()
      const body = {
        username: `user-${now}`,
        password: `pwd-${now}`,
        email: `email-${now}`
      }
      const event = createEvent('POST', '/', undefined, body)
      const { statusCode } = await handler(event)
      const itemsAfter = await countItems()
      expect(statusCode).toBe(200)
      expect(itemsAfter).toEqual(itemsBefore+1)
    })

    it('should not be able to create the same user twice', async () => {
      const itemsBefore = await countItems()
      const now = Date.now()
      const body = {
        username: `user-${now}`,
        password: `pwd-${now}`,
        email: `email-${now}`
      }
      const event = createEvent('POST', '/', undefined, body)
      const { statusCodeOne } = await handler(event)
      const itemsAfterOne = await countItems()
      expect(statusCodeOne).toBe(200)
      expect(itemsAfterOne).toEqual(itemsBefore+1)

      const { statusCodeTwo } = await handler(event)
      const itemsAfterTwo = await countItems()
      expect(statusCodeTwo).toBe(200)
      expect(itemsAfterTwo).toEqual(itemsBefore+1)
    })
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