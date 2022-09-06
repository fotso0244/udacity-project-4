import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import { httpErrorHandler } from 'middy/middlewares'
//import  cors  from '@middy/http-cors'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { CheckOwner } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const validOwner = await CheckOwner(todoId, userId)
    // TODO: Remove a TODO item by id
    if (!validOwner) {
      return {
          statusCode: 404,
          
          body: JSON.stringify({
              error: `UserId ${userId} is not owner for todo item with Id ${todoId}`
          })
      }
  }
    
    await deleteTodo(todoId, userId)
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
      body: JSON.stringify({
          
      }),
  };
    return response
  }
)

handler
  .use(httpErrorHandler())
  /*.use(
    cors({
      credentials: true
    })
  )*/
