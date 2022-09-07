import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import { httpErrorHandler } from 'middy/middlewares'
//import  cors  from '@middy/http-cors'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { CheckOwner } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const validOwner = await CheckOwner(todoId, userId)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    if (!validOwner) {
      return {
          statusCode: 404,
          
          body: JSON.stringify({
              error: `UserId ${userId} is not owner for todo item with Id ${todoId}`
          })
      }
  }

   await updateTodo(todoId, userId, updatedTodo)
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
      credentials: true,
      origin: '*'
    })
  )*/
