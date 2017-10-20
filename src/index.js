import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import InstanceWrapper from './InstanceWrapper'
import SpotifyExample from './components/SpotifyExample'
import App from './App'
import reducer from './reducers'
import registerServiceWorker from './registerServiceWorker'
import logger from 'redux-logger'

import './index.css'

import Home from './layouts/home/Home'
import Plan from './layouts/plan/Plan'

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;



const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      logger
    )
  )
)

window.jQuery = window.$;

// Initialize react-router-redux.

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <InstanceWrapper>
      <MuiThemeProvider>
        <Router history={history}>
          <Route path="/admin" component={App}>
            <IndexRoute component={Home} />
            <Route path="plan/:planAddress" component={Plan} />
          </Route>
          <Route path="/website" component={SpotifyExample}>
          </Route>
        </Router>
      </MuiThemeProvider>
    </InstanceWrapper>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
