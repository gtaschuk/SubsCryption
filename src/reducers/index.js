import { combineReducers } from 'redux'
import userReducer from '../user/userReducer'

const reducer = combineReducers({
  user: userReducer,
})

export default reducer
