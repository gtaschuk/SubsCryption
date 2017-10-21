import { actions } from '../actions'
const initialState = {
    planArray: []
}

const planArrayReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.NEW_PLAN_CREATED:
            const planArray = (state.planArray.indexOf(action.payload) >= 0)?
              state.planArray
              : [...state.planArray, action.payload]
            return Object.assign({}, state, {
                planArray
            })
        case actions.NEW_PLAN_CREATED:
            const planArray = (state.planArray.indexOf(action.payload) >= 0)?
              state.planArray
              : [...state.planArray, action.payload]
            return Object.assign({}, state, {
                planArray
            })
        default:
            return state;
    }
}

export default planArrayReducer
