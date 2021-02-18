import * as DynamoDB from 'aws-sdk/clients/dynamodb'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { dynamoDbConfig } from '../../src/lib/dynamoDbConfig'

const dynamodb = new DynamoDB(dynamoDbConfig)
const documentClient = new DocumentClient(dynamoDbConfig)

const { USER_TABLE_NAME: TableName } = process.env

export const deleteAllItems = async () => {
  const { Items } = await documentClient.scan({ TableName }).promise()
  for (const item of Items) {
    const deleteParams = {
      TableName,
      Key: {
        username: item.username
      }
    }

    await documentClient.delete(deleteParams).promise()
  }
}

export const createTableIfNotExists = async () => {
  const { Table } = await dynamodb.describeTable({ TableName }).promise()

  if (!Table) {
    const params = {
      AttributeDefinitions: [
        {
          AttributeName: 'username',
          AttributeType: 'S'
        },
        {
          AttributeName: 'name',
          AttributeType: 'S'
        },
        {
          AttributeName: 'passwordHash',
          AttributeType: 'S'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'username',
          KeyType: 'HASH'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST',
      TableName
    }
    await dynamodb.createTable(params).promise()
  }
}

export const insertItem = async (Item): Promise<void> => {
  await documentClient.put({
    TableName,
    Item
  }).promise()
}

export const countItems = async (): Promise<number> => {
  const { Table } = await dynamodb.describeTable({ TableName }).promise()
  return Table.ItemCount
}