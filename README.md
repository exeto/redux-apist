# redux-apist
[![Build Status][buildstat-image]][buildstat-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependency Status][depstat-image]][depstat-url]

> Creator API actions for [redux-thunk](https://github.com/gaearon/redux-thunk)

## Install

```bash
$ npm install --save redux-apist
```

## Usage

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Apist from 'redux-apist';
import reducer from './reducers';

const store = createStore(reducer, applyMiddleware(thunk));
const user = new Apist('users');

store.dispatch(user.fetch(10))
//=> GET /users/10
```

Within the used [`fetch`](https://fetch.spec.whatwg.org/). You can add polyfill to your project.

Configure to work with your API, by overriding methods.

```js
class CustomApist extends Apist {
  constructor(resource) {
    super(resource);

    // Used only when sending data.
    // By default `application/json`.
    this.contentType = 'application/json';

    // Fetch options.
    this.options = {};

    this.headers = {};
    this.host = 'http://example.com';
    this.namespace = 'api/v2';
  }

  handleError(err) {}

  // Serialization of sent data.
  serialize(data) {}

  // Deserializing the received data.
  deserialize(req, res) {}
}
```

## API

### ReduxApist(resource)

#### resource

Type: `string`

The name of the API resource.

### Instance

All CRUD methods return redux-thunk action.

#### .fetchAll([query])

> GET `/resource?query`

- `RESOURCE_FETCH_ALL_REQUEST`
- `RESOURCE_FETCH_ALL_SUCCESS`
- `RESOURCE_FETCH_ALL_FAILURE`

##### query

Type: `object`

#### .fetch(id, [query])

> GET `/resource/:id?query`

- `RESOURCE_FETCH_REQUEST`
- `RESOURCE_FETCH_SUCCESS`
- `RESOURCE_FETCH_FAILURE`

##### id

Type: `number|string`

##### query

Type: `object`

#### .create(data)

> POST `/resource`

- `RESOURCE_CREATE_REQUEST`
- `RESOURCE_CREATE_SUCCESS`
- `RESOURCE_CREATE_FAILURE`

##### data

Type: `any`

#### .update(id, data)

> PUT `/resource/:id`

- `RESOURCE_UPDATE_REQUEST`
- `RESOURCE_UPDATE_SUCCESS`
- `RESOURCE_UPDATE_FAILURE`

##### id

Type: `number|string`

##### data

Type: `any`

#### .delete(id)

> DELETE `/resource/:id`

- `RESOURCE_DELETE_REQUEST`
- `RESOURCE_DELETE_SUCCESS`
- `RESOURCE_DELETE_FAILURE`

##### id

Type: `any`

#### .actions

The creators of the [FSA](https://github.com/acdlite/flux-standard-action).

- `fetchAllRequest`
- `fetchAllSuccess`
- `fetchAllFailure`
- `fetchRequest`
- `fetchSuccess`
- `fetchFailure`
- `createRequest`
- `createSuccess`
- `createFailure`
- `updateRequest`
- `updateSuccess`
- `updateFailure`
- `deleteRequest`
- `deleteSuccess`
- `deleteFailure`

#### .types

```js
{
  fetchAllRequest: 'RESOURCE_FETCH_ALL_REQUEST',
  fetchAllSuccess: 'RESOURCE_FETCH_ALL_SUCCESS',
  fetchAllFailure: 'RESOURCE_FETCH_ALL_FAILURE',
  fetchRequest: 'RESOURCE_FETCH_REQUEST',
  fetchSuccess: 'RESOURCE_FETCH_SUCCESS',
  fetchFailure: 'RESOURCE_FETCH_FAILURE',
  createRequest: 'RESOURCE_CREATE_REQUEST',
  createSuccess: 'RESOURCE_CREATE_SUCCESS',
  createFailure: 'RESOURCE_CREATE_FAILURE',
  updateRequest: 'RESOURCE_UPDATE_REQUEST',
  updateSuccess: 'RESOURCE_UPDATE_SUCCESS',
  updateFailure: 'RESOURCE_UPDATE_FAILURE',
  deleteRequest: 'RESOURCE_DELETE_REQUEST',
  deleteSuccess: 'RESOURCE_DELETE_SUCCESS',
  deleteFailure: 'RESOURCE_DELETE_FAILURE',
}
```

## Related

- [apist](https://github.com/exeto/apist) - Simple REST API client

## License

[MIT](LICENSE.md) © [Timofey Dergachev](https://exeto.me/)

[buildstat-url]: https://travis-ci.org/exeto/redux-apist?branch=master
[buildstat-image]: https://img.shields.io/travis/exeto/redux-apist/master.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/exeto/redux-apist?branch=master
[coverage-image]: https://img.shields.io/coveralls/exeto/redux-apist/master.svg?style=flat-square
[depstat-url]: https://david-dm.org/exeto/redux-apist#info=Dependencies
[depstat-image]: https://img.shields.io/david/exeto/redux-apist.svg?style=flat-square
