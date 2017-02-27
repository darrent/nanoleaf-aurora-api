# JavaScript Nanoleaf Aurora API for node.js #

A node.js module, which provides a wrapper for the Nanoleaf Aurora API.

[![CircleCI](https://circleci.com/gh/darrent/nanoleaf-aurora-api/tree/master.svg?style=svg)](https://circleci.com/gh/darrent/nanoleaf-aurora-api/tree/master)

## Installation ##

Install with the node package manager [npm](http://npmjs.org):

```shell
$ npm install nanoleaf-aurora-client
```

## Examples ##

### Create the client ###

```javascript
var api = new AuroraApi({
    host: '192.168.1.160',
    base: '/api/beta/',
    port: '16021',
    accessToken: 'TOKEN'
  });

```