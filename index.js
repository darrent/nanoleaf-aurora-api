'use strict';

const fs = require('fs'),
  http   = require('http');

var AuroraApi = module.exports = function (options) {
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

  this.protocol    = options.protocol || 'http:';
  this.host        = options.host;
  this.port        = options.port || null;
  this.base        = options.base;
  this.accessToken = options.accessToken;
  this.timeout     = options.timeout || 2000;

  this.makeOptions = function (pathname, method) {
    var options = {
      protocol: this.protocol,
      hostname: this.host,
      port: this.port,
      path: `${this.base}${this.accessToken}${pathname}`,
      method: method
    };

    return options;
  };

  this.makeGetRequestOptions = function (pathname) {
    var options = this.makeOptions(pathname, 'GET');

    var requestOptions = {
      options: options
    };

    return requestOptions;
  };

  this.makePutRequest = function (pathname, body) {
    var options = this.makeOptions(pathname, 'PUT');

    var requestOptions = {
      options: options
    };

    if (body) {
      var bodyJSON = JSON.stringify(body);

      options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': bodyJSON.length
      };

      requestOptions.body = bodyJSON;
    }

    return requestOptions;
  };

  this.doRequest = function (requestOptions) {
    return new Promise((resolve, reject) => {
      var request = http.request(requestOptions.options, (response) => {
        var chunkedData = '';

        response.on('data', (chunk) => {
          chunkedData += chunk;
        });

        response.on('end', () => {
          resolve(chunkedData);
        });

      });

      if (requestOptions.body) {
        request.write(requestOptions.body);
      }

      request.end();

      request.on('response', function (res) {
        if (res.statusCode < 200 || res.statusCode > 299) {
          reject(res.statusCode);
        }
      });

      request.on('error', function (error) {
        reject(error);
      });

    });

  };
};

AuroraApi.prototype.getInfo = function () {
  const requestOptions = this.makeGetRequestOptions('/');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getPowerStatus = function () {
  const requestOptions = this.makeGetRequestOptions('/state/on');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.turnOn = function () {
  const requestOptions = this.makePutRequest('/state', {
    on: {
			value: true
		}
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.turnOff = function () {
  const requestOptions = this.makePutRequest('/state', {
    on: {
			value: false
		}
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getBrightness = function () {
  const requestOptions = this.makeGetRequestOptions('/state/brightness');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.setBrightness = function (value) {
  const requestOptions = this.makePutRequest('/state', {
    brightness: value
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getHue = function () {
  const requestOptions = this.makeGetRequestOptions('/state/hue');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.setHue = function (value) {
  const requestOptions = this.makePutRequest('/state', {
    hue: value
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getSat = function () {
  const requestOptions = this.makeGetRequestOptions('/state/sat');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.setSat = function (value) {
  const requestOptions = this.makePutRequest('/state', {
    sat: value
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getColourTemperature = function () {
  const requestOptions = this.makeGetRequestOptions('/state/ct');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.setColourTemperature = function (value) {
  const requestOptions = this.makePutRequest('/state', {
    ct: value
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getColourMode = function () {
  const requestOptions = this.makeGetRequestOptions('/state/colorMode');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getEffect = function () {
  const requestOptions = this.makeGetRequestOptions('/effects/select');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.setEffect = function (effect) {
  const requestOptions = this.makePutRequest('/effects', {
    'select': effect
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.listEffects = function () {
  const requestOptions = this.makeGetRequestOptions('/effects/effectsList');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getOrientation = function () {
  const requestOptions = this.makeGetRequestOptions('/panelLayout/globalOrientation');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getLayoutOptions = function () {
  const requestOptions = this.makeGetRequestOptions('/panelLayout/layout');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.identify = function () {
  const requestOptions = this.makePutRequest('/identify');

  return this.doRequest(requestOptions);
};