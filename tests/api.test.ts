import { handler } from "../src/api"
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

describe("Basic test", () => {
    it("should return ok", async () => {
        const { body, statusCode } = await handler(event)
        const { status } = JSON.parse(body)
        expect(statusCode).toBe(200)
        expect(status).toEqual('ok')
    })
})