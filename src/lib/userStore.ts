import { dynamoDbConfig } from './dynamoDbConfig'
import { DocumentClient, QueryInput, Key } from 'aws-sdk/clients/dynamodb'
import { User } from '../types/User'
import { isUser, mapUser, hashPassword } from './userHelpers'
import { SayWhatError } from './error'

const AWS_DYNAMODB_CONDITION_FAILED_ERROR = 'The conditional request failed'
const { USER_TABLE_NAME: TableName } = process.env
const dynamodb = new DocumentClient(dynamoDbConfig)

const removeEmpty = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

const recursiveGetUsers = async (users: User[] = [], lastEvaluatedKey?: Key): Promise<User[]> => {
  const params: QueryInput = {
    TableName,
    Select: 'SPECIFIC_ATTRIBUTES',
    AttributesToGet: ['username', 'imageUrl']
  }

  if (lastEvaluatedKey !== undefined) {
    params.ExclusiveStartKey = lastEvaluatedKey
  }

  const { Items, LastEvaluatedKey } = await dynamodb.query(params).promise()
  const accumulatedUsers = [...users, ...(Items as User[] || [])]

  if (LastEvaluatedKey) {
    return recursiveGetUsers(accumulatedUsers, LastEvaluatedKey)
  }

  return accumulatedUsers
}

export const getUsers = (): Promise<User[]> => recursiveGetUsers()

export const getUser = async (username: string): Promise<User> => {
  const params: DocumentClient.GetItemInput = {
    TableName,
    Key: {
      username
    }
  }

  try {
    const { Item } = await dynamodb.get(params).promise()

    if (!Item) {
      console.info('No match found in db for username', username)
      throw new SayWhatError('Not found', 404)
    }

    return Item as User
  } catch (error) {
    if (error instanceof SayWhatError) {
      throw error
    }

    console.error(error.message || error)
    throw new SayWhatError('Error finding user', 500)
  }
}

export const createUser = async (user: unknown): Promise<void> => {
  if (!isUser(user)) {
    throw new SayWhatError('Invalid userobject provided', 400)
  }

  const mappedUser = mapUser(user)
  const params: DocumentClient.PutItemInput = {
    TableName,
    Item: removeEmpty(mappedUser),
    ConditionExpression: 'username <> :username',
    ExpressionAttributeValues: {
      ':username': user.username
    }
  }

  try {
    await dynamodb.put(params).promise()
  } catch (error) {
    const errorMessage = error.message || error
    console.error('Error creating user', { errorMessage, params })
    if (errorMessage === AWS_DYNAMODB_CONDITION_FAILED_ERROR) {
      throw new SayWhatError('Cannot create user, user already exists', 400)
    }
    throw new SayWhatError('Cannot create user, failed to write to database', 500)
  }
}

export const updateUser = async (username: string, userdata: any): Promise<void> => {
  const params: DocumentClient.UpdateItemInput = {
    TableName,
    Key: { username },
    ExpressionAttributeValues: {
      ':email': userdata.email,
      ':name': userdata.name,
      ':imageUrl': userdata.imageUrl,
      ':active': userdata.active
    },
    UpdateExpression: 'SET email = :email, name = :name, imageUrl = :imageUrl, active = :active'
  }

  try {
    await dynamodb.update(params).promise()
  } catch (error) {
    console.error('Error updating user', { errorMessage: error.message || error, params })
    throw new SayWhatError('Cannot update user, failed to write to database', 500)
  }
}

export const changePassword = async (username: string, passwordHash: string): Promise<void> => {
  const params: DocumentClient.UpdateItemInput = {
    TableName,
    Key: { username },
    ExpressionAttributeValues: {
      ':passwordHash': passwordHash
    },
    UpdateExpression: 'SET passwordHash = :passwordHash'
  }

  try {
    await dynamodb.update(params).promise()
  } catch (error) {
    console.error('Error updating password on user', { errorMessage: error.message || error, params })
    throw new SayWhatError('Cannot update password, failed to write to database', 500)
  }
}