import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import InstanceWrapper from './InstanceWrapper'
import App from './App'
import reducer from './reducers'
import registerServiceWorker from './registerServiceWorker'

import './index.css'

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware
    )
  )
)

ReactDOM.render(
  <Provider store={store}>
    <InstanceWrapper>
      <MuiThemeProvider>
        <App/>
      </MuiThemeProvider>
    </InstanceWrapper>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
