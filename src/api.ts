import { APIGatewayEvent, Context } from 'aws-lambda'
import createAPI from 'lambda-api'
import { dynamodb } from './aws'
 
const api = createAPI({ base: process.env.BASEPATH })
 
api.get('/status', async (_req, res) => {
  try {
    const tables = await dynamodb.listTables().promise()
    return res.json({ status: 'ok', tables })
  } catch (error) {
    return res.status(500).json({ errorMessage: error })
  }
})

api.post('/hello', async ({ body, query }, res) => {
  try {
    const name = query.name || ''
    return res.json({ body: body, name })
  } catch (error) {
    return res.status(500).json({ errorMessage: error })
  }
})
 
export const handler = async (event: APIGatewayEvent, context?: Context) => {
  return await api.run(event, context)
}