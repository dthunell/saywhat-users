import DynamoDB from 'aws-sdk/clients/dynamodb'
import { ClientConfiguration } from 'aws-sdk/clients/dynamodb'

let config: ClientConfiguration = {}

if (process.env.ENVIRONMENT === 'docker') {
    config.region = 'eu-west-1'
    config.endpoint = 'http://localstack:4566'
    config.credentials = {
        accessKeyId: '123',
        secretAccessKey: '123'
    }
} if (process.env.ENVIRONMENT === 'pipeline') {
    config.region = 'eu-west-1'
    config.endpoint = 'http://localstack:4566'
    config.credentials = {
        accessKeyId: '123',
        secretAccessKey: '123'
    }
}

export const dynamodb = new DynamoDB(config)

