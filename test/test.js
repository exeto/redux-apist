import test from 'ava';
import Apist from '../src';

test('build url', t => {
  const user = new Apist('users');

  t.is(user.buildUrl(), '/users');
  t.is(user.buildUrl(20), '/users/20');
  t.is(user.buildUrl(20, { name: 'John' }), '/users/20?name=John');
  t.is(user.buildUrl(null, { name: 'John' }), '/users?name=John');
  user.namespace = 'api';
  t.is(user.buildUrl(20), '/api/users/20');
  user.host = 'http://example.com';
  t.is(user.buildUrl(20), 'http://example.com/api/users/20');
});

test('generate action types', t => {
  const user = new Apist('users');

  t.deepEqual(user.types, {
    fetchAllRequest: 'USERS_FETCH_ALL_REQUEST',
    fetchAllSuccess: 'USERS_FETCH_ALL_SUCCESS',
    fetchAllFailure: 'USERS_FETCH_ALL_FAILURE',
    fetchRequest: 'USERS_FETCH_REQUEST',
    fetchSuccess: 'USERS_FETCH_SUCCESS',
    fetchFailure: 'USERS_FETCH_FAILURE',
    createRequest: 'USERS_CREATE_REQUEST',
    createSuccess: 'USERS_CREATE_SUCCESS',
    createFailure: 'USERS_CREATE_FAILURE',
    updateRequest: 'USERS_UPDATE_REQUEST',
    updateSuccess: 'USERS_UPDATE_SUCCESS',
    updateFailure: 'USERS_UPDATE_FAILURE',
    deleteRequest: 'USERS_DELETE_REQUEST',
    deleteSuccess: 'USERS_DELETE_SUCCESS',
    deleteFailure: 'USERS_DELETE_FAILURE',
  });
});
