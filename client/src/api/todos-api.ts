import { apiEndpoint } from '../config'
import { Todo } from '../types/Todo';
import { CreateTodoRequest } from '../types/CreateTodoRequest';
import Axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest';

export async function getTodos(idToken: string): Promise<Todo[]> {
  console.log('Fetching todos')
  console.log('token: ', idToken)
  
  const response = await Axios.get(`/todos`, {
    proxy: {
      host: `${apiEndpoint}`
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log('Todos:', response.data)
  return response.data
  /*const response = await fetch(`${apiEndpoint}/todos`, {
                     method: 'get',
                     headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${idToken}`
                    }
                 })
  const result = await response.json()

  return result.Items*/
}

export async function createTodo(
  idToken: string,
  newTodo: CreateTodoRequest
): Promise<Todo> {
  const response = await Axios.post(`/todos`,  JSON.stringify(newTodo), {
    proxy: {
      host: `${apiEndpoint}`
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data
  /*const reply = await fetch(`${apiEndpoint}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(newTodo)
  })
  const result = await reply.json()
  return result.Item*/
}

export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  await Axios.patch(`/todos/${todoId}`, JSON.stringify(updatedTodo), {
    proxy: {
      host: `${apiEndpoint}`
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  /*const reply = await fetch(`${apiEndpoint}/todos/${todoId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify(updatedTodo)
  })*/
  
}

export async function deleteTodo(
  idToken: string,
  todoId: string
): Promise<void> {
  await Axios.delete(`/todos/${todoId}`, {
    proxy: {
      host: `${apiEndpoint}`
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
 /* const reply = await fetch(`${apiEndpoint}/todos/${todoId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })*/
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response = await Axios.post(`/todos/${todoId}/attachment`, '', {
    proxy: {
      host: `${apiEndpoint}`
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
  /*const reply = await fetch(`${apiEndpoint}/todos/${todoId}/attachment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify({
      todoId: todoId
    })
  })
  const result = await reply.json()
  return result*/
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
  /*await fetch(uploadUrl, {
    method: 'PUT',
    body: file
  })*/
}
