# JavaScript Nanoleaf Aurora API for node.js #

A node.js module, which provides a wrapper for the Nanoleaf Aurora API.

## Installation ##

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