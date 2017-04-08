/* eslint class-methods-use-this: off */

import avali from 'avali';
import queryStringify from 'qs/lib/stringify';
import createAction from 'redux-actions/lib/createAction';

import join from './utils/urlJoin';
import constantCase from './utils/constantCase';

export default class ReduxApist {
  constructor(resource) {
    avali('str', resource);

    this.cache = {};
    this.resource = resource;
    this.host = null;
    this.namespace = null;
    this.contentType = 'application/json';
    this.options = {};
    this.headers = {};
    this.actions = {};
    this.types = {};
    this.createActions();
  }

  callApi(method, { id, query, data, type } = {}) {
    return (dispatch, getState) => {
      const url = this.buildUrl(id, query);
      const { cache } = this;

      if (method === 'GET' && cache[url]) {
        return cache[url];
      }

      const options = Object.assign({}, this.options);
      options.method = method;
      options.headers = this.headers;

      if (data && method !== 'GET') {
        options.headers['Content-Type'] = this.contentType;
        options.body = this.serialize(data);
      }

      dispatch(this.actions[`${type}Request`]());

      const request = fetch(url, options)
        .then(res => this.deserialize(options, res))
        .then((result) => {
          delete cache[url];
          result = method === 'DELETE' ? id : result;
          dispatch(this.actions[`${type}Success`](result));
          return result;
        })
        .catch((err) => {
          delete cache[url];
          throw err;
        })
        .catch(err => this.handleError({ err, type, dispatch, getState }));

      if (method === 'GET') {
        this.cache[url] = request;
      }

      return request;
    };
  }

  buildUrl(id, query) {
    query = query && `?${queryStringify(query)}`;
    return join(this.host, this.namespace, this.resource, id, query);
  }

  serialize(data) {
    return JSON.stringify(data);
  }

  deserialize(req, res) {
    if (res.ok) return req.method === 'DELETE' || res.json();

    throw new Error(`${res.status} ${res.statusText}`);
  }

  handleError({ err, type, dispatch }) {
    dispatch(this.actions[`${type}Failure`](err));
    throw err;
  }

  fetchAll(query) {
    avali(['obj, undef'], query);
    return this.callApi('GET', { query, type: 'fetchAll' });
  }

  fetch(id, query) {
    avali(['num, str', 'obj, undef'], arguments);
    return this.callApi('GET', { id, query, type: 'fetch' });
  }

  create(data) {
    return this.callApi('POST', { data, type: 'create' });
  }

  update(id, data) {
    avali(['num, str'], id);
    return this.callApi('PUT', { id, data, type: 'update' });
  }

  delete(id) {
    avali(['num, str'], id);
    return this.callApi('DELETE', { id, type: 'delete' });
  }

  createActions() {
    ['fetchAll', 'fetch', 'create', 'update', 'delete'].forEach((operation) => {
      ['Request', 'Success', 'Failure'].forEach((status) => {
        const shortType = `${operation}${status}`;
        const type = constantCase(`${this.resource}_${shortType}`);
        this.types[shortType] = type;
        this.actions[shortType] = createAction(type);
      });
    });
  }
}
