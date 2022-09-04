import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import { httpErrorHandler } from 'middy/middlewares'
import  cors  from '@middy/http-cors'

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { CheckOwner } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const url = await createAttachmentPresignedUrl(todoId)
    const validOwner = await CheckOwner(todoId, userId)

    if (!validOwner) {
        return {
            statusCode: 404,
            /*headers: {
                'Access-Control-Allow-Origin': '*'
            },*/
            body: JSON.stringify({
                error: `UserId ${userId} is not owner for todo item with Id ${todoId}`
            })
        }
    }
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const response = {
      statusCode: 201,
      /*headers: {
         'Access-Control-Allow-Origin': '*'
      },*/
      body: JSON.stringify({
          uploadUrl: url
      }),
  };
  return response;
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      origin: '*'
    })
  )

