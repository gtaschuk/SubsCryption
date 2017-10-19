export const actions = {
  NEW_PLAN_CREATED: 'NEW_PLAN_CREATED',
}

export const newPlanAdded = (hubAddress, owner, operatorCreator) => {
  return dispatch => {
    dispatch({
      type: actions.NEW_PLAN_CREATED,
      details: {
        // depositWeis,
        // operatorContractAddress,
        // owner,
        // operatorCreator
      }
    })
  }
}
