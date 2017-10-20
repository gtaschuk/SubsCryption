import { combineReducers } from 'redux'
import plansReducer from './plans'
import { routerReducer } from 'react-router-redux'

const reducer = combineReducers({
  routing: routerReducer,
  plans: plansReducer,
})

export default reducer
