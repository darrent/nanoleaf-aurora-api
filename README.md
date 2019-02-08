# Nanoleaf Aurora API client #

## ⚠️ This project is no active.  I no longer have access to a Nanoleaf device ⚠️ ##

A node.js module, which provides a wrapper for the Nanoleaf Aurora API.

[![CircleCI](https://circleci.com/gh/darrent/nanoleaf-aurora-api/tree/master.svg?style=svg)](https://circleci.com/gh/darrent/nanoleaf-aurora-api/tree/master)

## Installation ##

Install with the node package manager [npm](https://www.npmjs.com/package/nanoleaf-aurora-client):

```shell
$ npm install nanoleaf-aurora-client
```

## Get your token ##

You can request via API query a token from your nanoleaf panel controller.
To do so, hold the on-off button down for 5-7 seconds until the LED starts flashing in a pattern.

The run the script "getToken.js" - token will be print in the console.

Note: edit the js file to use the correct IP and PORT to query your nanoleaf Aurora.

## Examples ##

### Create the client ###

```javascript
var api = new AuroraApi({
    host: '192.168.1.160',
    base: '/api/v1/',
    port: '16021',
    accessToken: 'TOKEN'
  });

```

### Get device information ###

```javascript
api.getInfo()
  .then(function(info) {
    console.log('Device information: ' + info);
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Get power status ###

```javascript
api.getPowerStatus()
  .then(function(info) {
    console.log('Power status: ' + info);
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Turn the device on ###

```javascript
api.turnOn()
  .then(function() {
    console.log('Success!');
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Turn the device off ###

```javascript
api.turnOff()
  .then(function() {
    console.log('Success!');
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Get the current brightness value ###

```javascript
api.getBrightness()
  .then(function(brightness) {
    console.log('Brightness: ' + brightness);
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Set the brightness value ###

```javascript
api.setBrightness(50)
  .then(function() {
    console.log('Success!');
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Get the current hue value ###

```javascript
api.getHue(50)
  .then(function(hue) {
    console.log('Hue: ' + hue);
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Set the hue value ###

```javascript
api.setHue(50)
  .then(function() {
    console.log('Success!');
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Get the current colour temperature ###

```javascript
api.getColourTemperature()
  .then(function(temperature) {
    console.log('Colour temperature: ' + temperature);
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Set the colour temperature ###

```javascript
api.setColourTemperature(100)
  .then(function() {
    console.log('Success!');
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Get the current colour mode ###

```javascript
api.getColourMode()
  .then(function(colourMode) {
    console.log('Colour mode: ' + colourMode);
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Get the current effect ###

```javascript
api.getEffect()
  .then(function(effect) {
    console.log('Current effect: ' + effect);
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Set the current effect ###

```javascript
api.setEffect('Nemo')
  .then(function() {
    console.log('Success!');
  })
  .catch(function(err) {
    console.error(err);
  });
```

### List all effects ###

```javascript
api.listEffects()
  .then(function(effects) {
    console.log('Effects: ' + effects);
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Get the device orientation ###

```javascript
api.getOrientation()
  .then(function(orientation) {
    console.log('Orientation: ' + orientation);
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Get the layout options ###

```javascript
api.getLayoutOptions()
  .then(function(layout) {
    console.log('Layout: ' + layout);
  })
  .catch(function(err) {
    console.error(err);
  });
```

### Identify (flash the panels) ###

```javascript
api.identify()
  .then(function() {
    console.log('Success!');
  })
  .catch(function(err) {
    console.error(err);
  });
```

## Changelog ##

### 1.2.2 (2018.01.18)
- (Xyala) Added script to get token.

### 1.1.8 (2018.01.18)
- (darrent) Fixed unit tests.  No additional features added.

### 1.1.5 (2017.11.13)
- (oliverschulze) added setSat and getSat function
- (oliverschulze) adapted state changing api calls, to match Nanoleaf Aurora 2.2.0 firmware
