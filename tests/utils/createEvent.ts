import { APIGatewayEvent } from 'aws-lambda'

const event: APIGatewayEvent = {
    body: null,
    headers: { },
    multiValueHeaders: { },
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '/status',
    pathParameters: { },
    queryStringParameters: { },
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext:  {
        accountId: 'string',
        apiId: 'string',
        authorizer: null,
        protocol: 'GET',
        httpMethod: 'string',
        identity: {
            accessKey: null,
            accountId: null,            
            apiKey: null,
            apiKeyId: null,
            caller: null,
            cognitoAuthenticationProvider: null,
            cognitoAuthenticationType: null,
            cognitoIdentityId: null,
            cognitoIdentityPoolId: null,
            principalOrgId: null,
            sourceIp: 'string',
            user: null,
            userAgent: null,
            userArn: null,
        },
        path: '/status',
        stage: 'stage',
        requestId: 'string',
        requestTimeEpoch: 1,
        resourceId: 'string',
        resourcePath: 'string',
    },
    resource: ''
}

export const createEvent = (method: string, path: string, queryStringParameters?: any, body?: any): APIGatewayEvent => {
  const e = { ...event}
  e.path = path
  e.requestContext.path = path
  e.httpMethod = method
  e.requestContext.protocol = method

  if (queryStringParameters) {
    e.queryStringParameters = queryStringParameters
  }

  if (body) {
    e.body = body
  }

  return e
}