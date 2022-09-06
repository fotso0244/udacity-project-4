import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'


interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  
  constructor(props: TodosProps) {
    super(props)
    this.state =  {
      todos: [],
      newTodoName: '',
      loadingTodos: true
    }
  }
  //state: TodosState =
  
  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        dueDate})
        console.log('newTodo', newTodo)
     /* var todostring = `{"todos":"${this.state.todos}"}`
      var todosCopy: Todo[] = []
      var jsonData = JSON.parse(todostring);
for (var i = 0; i < jsonData.todos.length; i++) {
  var elt = jsonData.todos[i];
  todosCopy[i] = elt
    //console.log(counter.counter_name);
}
todosCopy[i] = newTodo*/
const newTodoStr = JSON.stringify(newTodo)
const todo = JSON.parse(newTodoStr)
setTimeout(() => { this.state.todos.push(todo.newItem) }, 2000)

      this.setState({
        //todos: [...this.state.todos, newTodo]
        todos: this.state.todos,
        newTodoName: this.state.newTodoName,
        
      })
    } catch(error) {
      alert('Todo creation failed')
      console.log(error)
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const todoslist = await getTodos(this.props.auth.getIdToken())
      const todosString = JSON.stringify(todoslist)
      var todos: Todo[] = []
      var jsonData = JSON.parse(todosString);
for (var i = 0; i < jsonData.todos.length; i++) {
  var elt = jsonData.todos[i];
  todos.push(elt)
  //todosCopy[i] = elt
}
      /*let todos = this.state.todos.slice()
      for (var i = 0; i < todoslist.length; i++) {
         todos.push(todoslist[i])    
      }*/
      this.setState({
        todos: todos,
        loadingTodos: false
       },() => {console.log('todoslist', this.state.todos)})
      
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  /*async componentDidUpdate(prevProps: TodosProps, prevState: TodosState) {
    
    const todos = await getTodos(this.props.auth.getIdToken())
    if (this.state.todos.length === 0) {
      const todoslist = await getTodos(this.props.auth.getIdToken())
      let todos = this.state.todos.slice()
      for (var i = 0; i < todoslist.length; i++) {
         todos.push(todoslist[i])    
      }
      this.setState({
        todos,
        loadingTodos: false
       }, () => {console.log('todolist2', this.state.todos)})
       //console.log(this.state.todos);
       
      //  , () => {console.log('todolist', this.state.todos) })
       
      }
  }*/

  render() {
    return (
      <div>
        <Header as="h1">TODOs</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
        
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos && this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={pos}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
