import ReduxApist from './ReduxApist';

export default function bindActionCreators(apistInstance, dispatch) {
  if (!(apistInstance instanceof ReduxApist)) {
    throw new Error('Expected an instance of ReduxApist.');
  }

  const actions = {};
  ['fetchAll', 'fetch', 'create', 'update', 'delete'].forEach((operation) => {
    actions[operation] = (...args) =>
      dispatch(apistInstance[operation].call(apistInstance, ...args));
  });
  return actions;
}
