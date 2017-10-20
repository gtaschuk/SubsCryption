import { combineReducers } from 'redux'
import plansReducer from './plans'
import planReducer from './plan'
import { routerReducer } from 'react-router-redux'

const reducer = combineReducers({
  routing: routerReducer,
  plans: plansReducer,
})

export default reducer
