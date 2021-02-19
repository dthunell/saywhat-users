import { ClientConfiguration } from 'aws-sdk/clients/dynamodb'

const { ENVIRONMENT } = process.env
const config: ClientConfiguration = {}

if (ENVIRONMENT === 'docker') {
  config.region = 'eu-west-1'
  config.endpoint = 'http://localstack:4566'
  config.credentials = {
    accessKeyId: '123',
    secretAccessKey: '123'
  }
} else if (ENVIRONMENT === 'pipeline') {
  config.region = 'eu-west-1'
  config.endpoint = 'http://localstack:4566'
  config.credentials = {
    accessKeyId: '123',
    secretAccessKey: '123'
  }
}

export const dynamoDbConfig = config