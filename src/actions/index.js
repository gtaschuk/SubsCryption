export const actions = {
  NEW_PLAN_CREATED: 'NEW_PLAN_CREATED',
}

export const newPlanCreated = (payload) => {
  return dispatch => {
    console.log('dispatch, attempt...')
    dispatch({
      type: actions.NEW_PLAN_CREATED,
      payload
    })
  }
}
