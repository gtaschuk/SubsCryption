import { combineReducers } from 'redux'
import userReducer from '../user/userReducer'
import { routerReducer } from 'react-router-redux'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
})

export default reducer
