import { actions } from '../actions'
const initialState = {
    planArray: [],
    user: {
      loaded: false,
      address: null,
      plansSubscribed: [],
      plansManaged: []
    },
    websiteIsActive: false
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
        case actions.SET_DISABLED:
            return Object.assign({}, state, {
                websiteIsActive: false
            })       
        case actions.SET_ENABLED:
            return Object.assign({}, state, {
                websiteIsActive: true
            })
        default:
            return state;
    }
}

export default planArrayReducer
