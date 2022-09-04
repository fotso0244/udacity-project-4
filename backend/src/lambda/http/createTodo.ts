import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import middy from '@middy/core'
import  cors  from '@middy/http-cors'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    const userId = getUserId(event)
    const newItem = await createTodo(newTodo, userId)
    
    const response = {
      statusCode: 201,
      
      body: JSON.stringify({
          newItem
      }),
  };
  return response;
})

handler.use(
  cors({
    credentials: true,
    origin: '*'
  })
)
