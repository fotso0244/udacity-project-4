import React, { useEffect, useState } from 'react'
import Auth from './auth/Auth'
import { Routes, Route } from 'react-router-dom'
import Callback from './components/Callback'
//import createHistory from 'history/createBrowserHistory'
import { createBrowserHistory } from 'history'
import { CustomRouter } from './router/customRouter'
import ReactDOMServer from 'react-dom/server'
import App from './App';
const history = createBrowserHistory()
var todoId: string = ''
const auth = new Auth(history)
const location = window.location.href
console.log('location', location)
if (/todo/.test(location) && /edit/.test(location)) {
  todoId = location.substr(28, 36)
}
console.log('todoId for edit', todoId)
const match = { params: { todoId: todoId}}
/*const handleAuthentication = (props: any) => {
  const location = props.location
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication()
  }
}*/

export function makeAuthRouting() {
  
  return (
    <CustomRouter history={history} basename="/">
      <div>
      <Routes>
        <Route
          path="/callback"
          //element={<div> {todo} </div>}
          //element={<Callback />}
          element={<>{ JSON.stringify(Callback(auth)) }</>}
          /*render={props => {
            handleAuthentication(props)
            return <Callback />
          }}*/
        />
        <Route
          path="*"
          element={<App auth={auth} history={history} match={match}/>}
          /*render={props => {
            return <App auth={auth} {...props} />
          }}*/
        />
        </Routes>
        { /*<Route path="/" render={(props) => <App auth={auth} {...props} />} />
          <Route path="/home" render={(props) => <Home auth={auth} {...props} />} /> */}
      </div>
    </CustomRouter>
    
  )
}
