const initialState = {
    addresses: []
}

const plansReducer = (state = initialState, action) => {
    switch (action.type) {
        case "PLAN_CREATED":
            var addresses = state.addresses.slice();
            addresses.push(action.payload);
            return Object.assign({}, state, {
                addresses: addresses
            })
        default:
            return state;
    }
}

export default plansReducer
