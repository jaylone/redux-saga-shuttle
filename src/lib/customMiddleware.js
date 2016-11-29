export default ({ dispatch, getState }) => next => action => {
  const wrapperActions = Object.defineProperty(action, '@@redux-shuttle/ACTION', {value: true});
  console.log('customMiddleware run :', action);
  return next(wrapperActions);
};
