import test from 'ava';
import nock from 'nock';
import fetch from 'node-fetch';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Apist, { bindActionCreators } from '../src';

global.fetch = fetch;
const mockStore = configureMockStore([thunk]);
const scope = nock('http://example.com');

class TestApist extends Apist {
  constructor(resource) {
    super(resource);
    this.host = 'http://example.com';
  }
}

test('fetch all', async t => {
  const user = new TestApist('users');
  const store = mockStore();
  scope.get('/users').reply(200, [{ name: 'John' }]);

  await store.dispatch(user.fetchAll());

  t.deepEqual(store.getActions(), [
    user.actions.fetchAllRequest(),
    user.actions.fetchAllSuccess([{ name: 'John' }]),
  ]);
});

test('fetch', async t => {
  const user = new TestApist('users');
  const store = mockStore();
  scope.get('/users/20').reply(200, { name: 'John' });

  await store.dispatch(user.fetch(20));

  t.deepEqual(store.getActions(), [
    user.actions.fetchRequest(),
    user.actions.fetchSuccess({ name: 'John' }),
  ]);
});

test('create', async t => {
  const user = new TestApist('users');
  const store = mockStore();
  scope.post('/users').reply(201, (_, body) => body);

  await store.dispatch(user.create({ name: 'John' }));

  t.deepEqual(store.getActions(), [
    user.actions.createRequest(),
    user.actions.createSuccess({ name: 'John' }),
  ]);
});

test('update', async t => {
  const user = new TestApist('users');
  const store = mockStore();
  scope.put('/users/20').reply(200, (_, body) => body);

  await store.dispatch(user.update(20, { name: 'John' }));

  t.deepEqual(store.getActions(), [
    user.actions.updateRequest(),
    user.actions.updateSuccess({ name: 'John' }),
  ]);
});

test('delete', async t => {
  const user = new TestApist('users');
  const store = mockStore();
  scope.delete('/users/20').reply(204);

  await store.dispatch(user.delete(20));

  t.deepEqual(store.getActions(), [
    user.actions.deleteRequest(),
    user.actions.deleteSuccess(20),
  ]);
});

test('error 404', async t => {
  const user = new TestApist('users');
  const store = mockStore();
  scope.get('/users/404').reply(404);

  try {
    await store.dispatch(user.fetch(404));
  } catch (err) {
    t.deepEqual(store.getActions(), [
      user.actions.fetchRequest(),
      user.actions.fetchFailure(err),
    ]);
  }
});

test('combine requests', async t => {
  const user = new TestApist('users');
  const store = mockStore();
  scope.get('/users').reply(200, [{ name: 'John' }]);

  await Promise.all([
    store.dispatch(user.fetchAll()),
    store.dispatch(user.fetchAll()),
  ]);

  t.deepEqual(store.getActions(), [
    user.actions.fetchAllRequest(),
    user.actions.fetchAllSuccess([{ name: 'John' }]),
  ]);
});

test('bindActionCreators', async t => {
  const user = new TestApist('users');
  const store = mockStore();

  scope.get('/users').reply(200, [{ name: 'John' }]);
  scope.get('/users/20').reply(200, { name: 'John' });
  scope.post('/users').reply(201, (_, body) => body);
  scope.put('/users/20').reply(200, (_, body) => body);
  scope.delete('/users/20').reply(204);

  const actions = bindActionCreators(user, store.dispatch);

  await actions.fetchAll();
  await actions.fetch(20);
  await actions.create({ name: 'John' });
  await actions.update(20, { name: 'John' });
  await actions.delete(20);

  t.deepEqual(store.getActions(), [
    user.actions.fetchAllRequest(),
    user.actions.fetchAllSuccess([{ name: 'John' }]),
    user.actions.fetchRequest(),
    user.actions.fetchSuccess({ name: 'John' }),
    user.actions.createRequest(),
    user.actions.createSuccess({ name: 'John' }),
    user.actions.updateRequest(),
    user.actions.updateSuccess({ name: 'John' }),
    user.actions.deleteRequest(),
    user.actions.deleteSuccess(20),
  ]);
});

test('bindActionCreators wrong argument', t => {
  t.throws(() => bindActionCreators(123), 'Expected an instance of ReduxApist.');
});
