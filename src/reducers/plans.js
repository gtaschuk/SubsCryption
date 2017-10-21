import { actions } from '../actions'
const initialState = {
    planArray: [],
    user: {
      loaded: false,
      address: null,
      plansSubscribed: [],
      plansManaged: []
    },
}

const planArrayReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.NEW_PLAN_CREATED:
            const planArray = (state.planArray.indexOf(action.payload) >= 0)?
              state.planArray
              : [...state.planArray, action.payload]
            // This is a bit broken, don't use...
            const plansManaged = ((state.user.plansManaged.indexOf(action.payload) >= 0) && (action.payload.owner !== state.user.address))?
              state.user.plansManaged
              : [...state.user.plansManaged, action.payload]
            return Object.assign({}, state, {
                planArray,
                plansManaged,
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
