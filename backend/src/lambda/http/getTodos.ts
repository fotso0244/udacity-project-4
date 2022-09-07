import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
//import middy from '@middy/core'
//import { cors } from 'middy/middlewares'
//import  cors  from '@middy/http-cors'

import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here

    const userId = getUserId(event)
    const todos = await getTodosForUser(userId)

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
      body: JSON.stringify({
          todos
      }),
  };
  return response;
}

/*handler.use(
  cors({
    credentials: true,
    origin: '*'
  })
)*/
