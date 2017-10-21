export const actions = {
  NEW_PLAN_CREATED: 'NEW_PLAN_CREATED',
  SET_DISABLED: 'SET_DISABLED',
  SET_ENABLED: 'SET_ENABLED',
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

export const setDisabled = () => {
  return dispatch => {
    dispatch({
      type: actions.SET_DISABLED,
    })
  }
}

export const setEnabled = () => {
  return dispatch => {
    dispatch({
      type: actions.SET_ENABLED,
    })
  }
}
