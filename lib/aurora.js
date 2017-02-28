'use strict';

const fs    = require('fs'),
      http  = require('http');

var AuroraApi = module.exports = function(options) {
  var self = this;

  if (!options) {
    throw new Error('Missing options');
  }

  if (!options.host) {
    throw new Error('Missing \'host\' property');
  }

  if (!options.base) {
    throw new Error('Missing \'base\' property');
  }

  if (!options.accessToken) {
    throw new Error('Missing \'accessToken\' property');
  }

  this.protocol = options.protocol || 'http:';
  this.host = options.host;
  this.port = options.port || null;
  this.base = options.base;
  this.accessToken = options.accessToken;
  this.timeout = options.timeout || 2000;

  this.makeOptions = function(pathname) {
    var options = {
      protocol: this.protocol,
      hostname: this.host,
      port: this.port,
      path: `${this.base}${this.accessToken}${pathname}`
    };

    return options;
  };

  this.makeGetOptions = function(pathname) {
    var options = this.makeOptions(pathname);
    options.method = 'GET';

    return options;
  };

  this.makePutOptions = function(pathname, body) {
    var options = this.makeOptions(pathname);
    options.method = 'PUT';

    if (body) {
      options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      };
    }

    return options;
  };

  this.doRequest = function(options, requestData) {
    return new Promise((resolve, reject) => {
      var request = http.request(options, (response) => {
        var chunkedData = '';

        response.on('data', (chunk) => {
          chunkedData += chunk;
        });

        response.on('end', () => {
          resolve(chunkedData);
        });

      });

      if (requestData) {
        request.write(requestData);
      }

      request.end();

      request.on('response', function(res) {
        if (res.statusCode < 200 || res.statusCode > 299) {
          reject(res.statusCode);
        }
      });

      request.on('error', function(error) {
        reject(error);
      });

    });

  };
};

AuroraApi.prototype.getInfo = function() {
  const options = this.makeGetOptions('/');
  return this.doRequest(options);
};

AuroraApi.prototype.getPowerStatus = function() {
  const options = this.makeGetOptions('/state/on');
  return this.doRequest(options);
};

AuroraApi.prototype.turnOn = function() {
  const body = JSON.stringify({
    value: true
  });
  const options = this.makePutOptions('/state/on', body);

  return this.doRequest(options, body);
};

AuroraApi.prototype.turnOff = function() {
  const body = JSON.stringify({
    value: false
  });
  const options = this.makePutOptions('/state/on', body);

  return this.doRequest(options, body);
};

AuroraApi.prototype.getBrightness = function() {
  const options = this.makeGetOptions('/state/brightness');
  return this.doRequest(options);
};

AuroraApi.prototype.setBrightness = function(value) {
  const body = JSON.stringify({
    'brightness': value
  });
  const options = this.makePutOptions('/state/brightness', body);

  return this.doRequest(options, body);
};

AuroraApi.prototype.getHue = function() {
  const options = this.makeGetOptions('/state/hue');
  return this.doRequest(options);
};

AuroraApi.prototype.setHue = function(value) {
  const body = JSON.stringify({
    'hue': value
  });
  const options = this.makePutOptions('/state/hue', body);

  return this.doRequest(options, body);
};

AuroraApi.prototype.getColourTemperature = function() {
  const options = this.makeGetOptions('/state/ct');
  return this.doRequest(options);
};

AuroraApi.prototype.setColourTemperature = function(value) {
  const body = JSON.stringify({
    'ct': value
  });
  const options = this.makePutOptions('/state/ct', body);

  return this.doRequest(options, body);
};

AuroraApi.prototype.getColourMode = function() {
  const options = this.makeGetOptions('/state/colorMode');
  return this.doRequest(options);
};

AuroraApi.prototype.getEffect = function() {
  const options = this.makeGetOptions('/effects/select');
  return this.doRequest(options);
};

AuroraApi.prototype.selectEffect = function(effect) {
  const body = JSON.stringify({
    'select': effect
  });
  const options = this.makePutOptions('/effects', body);

  return this.doRequest(options, body);
};

AuroraApi.prototype.listEffects = function() {
  const options = this.makeGetOptions('/effects/list');
  return this.doRequest(options);
};

AuroraApi.prototype.getOrientation = function() {
  const options = this.makeGetOptions('/panelLayout/globalOrientation');
  return this.doRequest(options);
};

AuroraApi.prototype.getLayoutOptions = function() {
  const options = this.makeGetOptions('/panelLayout/layout');
  return this.doRequest(options);
};

AuroraApi.prototype.identify = function() {
  const options = this.makePutOptions('/identify');
  return this.doRequest(options);
};