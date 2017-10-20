// NOTE:: Many of these functions will not use redux/dispatch for now.
export const addBalance = (planInstance, user, amount) => {
  console.log('addddd', { from: user, value: amount })
  planInstance.addBalance({ from: user, value: amount })
  .then((tx) => {
    // dispatch ({ TODO })
  })
  .catch(function(e) {
    // TODO:: Handle this error.
  })
}
