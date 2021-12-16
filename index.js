'use strict';

const fs = require('fs'),
    http = require('http'),
    EventSource = require('eventsource'),
    timeout = 2000;

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
  this.timeout     = options.timeout || timeout;

  this.SSEEventSource;

  this.makeOptions = function (pathname, method) {
    var options = {
      protocol: this.protocol,
      hostname: this.host,
      port: this.port,
      path: `${this.base}${this.accessToken}${pathname}`,
      method: method,
      timeout: this.timeout
    }

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
        'Content-Length': Buffer.byteLength(bodyJSON)
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

  this.rgb2hsv = function  () {
    var rr, gg, bb,
    r = arguments[0] / 255,
    g = arguments[1] / 255,
    b = arguments[2] / 255,
    h, s,
    v = Math.max(r, g, b),
    diff = v - Math.min(r, g, b),
    diffc = function(c){
      return (v - c) / 6 / diff + 1 / 2;
    };

    if (diff == 0) {
      h = s = 0;
    } else {
      s = diff / v;
      rr = diffc(r);
      gg = diffc(g);
      bb = diffc(b);

      if (r === v) {
        h = bb - gg;
      }else if (g === v) {
        h = (1 / 3) + rr - bb;
      }else if (b === v) {
        h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
        h += 1;
      }else if (h > 1) {
        h -= 1;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  };

  this.subscribeSSE = function(callback) {
    return new Promise((resolve, reject) => {

      this.SSEEventSource = new EventSource(`${this.protocol}//${this.host}:${this.port}${this.base}${this.accessToken}/events?id=1,3,4`);

      this.SSEEventSource.onopen = function(event) {
        resolve();
      };

      this.SSEEventSource.onmessage = function(event) {
        var data = {};
        var error;

        try {
          var parsedData = JSON.parse(event.data);

          data.eventID = Number.parseInt(event.lastEventId);
          data.events = parsedData.events;
        }
        catch (err) {
          error = err;
          data = {}; //empty incomplete data object
        }
        callback(data, error);
      };

      this.SSEEventSource.onerror = function(error) {
        var errorMessage = error.type + ": " + error.message + " (status: " + error.status + ")";
        if (reject) reject(errorMessage);
        else callback({}, errorMessage);
      };
    });
  };
};

AuroraApi.Events = {state: 1, effects: 3, touch: 4};
AuroraApi.StateAttributes = {on: 1, brightness: 2, hue: 3, saturation: 4, cct: 5, colorMode: 6};
AuroraApi.EventAttributes = {event: 1, eventList: 2};
AuroraApi.GestureID = {SingleTap: 0, DoubleTap: 1, SwipeUp: 2, SwipeDown: 3, SwipeLeft: 4, SwipeRight: 5};

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
    on: { value: true }
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.turnOff = function () {
  const requestOptions = this.makePutRequest('/state', {
    on: { value: false }
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getBrightness = function () {
  const requestOptions = this.makeGetRequestOptions('/state/brightness');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.setBrightness = function (value, duration = 0) {
  const requestOptions = this.makePutRequest('/state', {
	brightness: {
	              value: value,
                duration : duration
	            }
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getHue = function () {
  const requestOptions = this.makeGetRequestOptions('/state/hue');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.setHue = function (value) {
  const requestOptions = this.makePutRequest('/state', {
    hue: { value: value }
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getSat = function () {
  const requestOptions = this.makeGetRequestOptions('/state/sat');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.setSat = function (value) {
  const requestOptions = this.makePutRequest('/state', {
    sat: { value: value }
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.setHSV = function (h,s,v) {
  const requestOptions = this.makePutRequest('/state', {
    sat: { value: s },
    hue: { value: h },
    brightness: { value: v }
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.setRGB = function (r,g,b) {
  var hsv = this.rgb2hsv(r,g,b);
  const requestOptions = this.makePutRequest('/state', {
    sat: { value: hsv.s },
    hue: { value: hsv.h },
    brightness: { value: hsv.v }
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.getColourTemperature = function () {
  const requestOptions = this.makeGetRequestOptions('/state/ct');

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.setColourTemperature = function (value) {
  const requestOptions = this.makePutRequest('/state', {
    ct: { value: value }
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
    select: effect
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.writeEffect = function (effectObj) {
  const requestOptions = this.makePutRequest('/effects', {
    write: effectObj
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

AuroraApi.prototype.setRhythmMode = function (rhythmMode) {
  const requestOptions = this.makePutRequest('/rhythm/rhythmMode', {
  	rhythmMode: rhythmMode
  });

  return this.doRequest(requestOptions);
};

AuroraApi.prototype.startSSE = function(callback) {
  return this.subscribeSSE(callback);
};

AuroraApi.prototype.stopSSE = function() {
  if (this.SSEEventSource) this.SSEEventSource.close();
};

// automatically obtain an auth token when device is in pairing mode
AuroraApi.getAuthToken = function (address, port) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: address,
      port: port,
      path: "/api/v1/new",
      method: "POST",
      timeout: timeout
    };

    const req = http.request(options, (res) => {
      const statusCode = res.statusCode;
      const contentType = res.headers['content-type'];

      switch (statusCode) {
        case 200:	if (!/^application\/json/.test(contentType)) {
                    reject({errorCode: "ErrorJSON", message: "Error obtaining authorization token!", messageDetail: "Invalid content-type. Expected \"application/json\" but received " + contentType});
                    return;
                  }
                  break;
        case 401: reject({errorCode: "ErrorUnauthorized", message: "Getting authorization token failed because access is unauthorized (is the device in pairing mode?)"});
                return;
        case 403: reject({errorCode: "ErrorUnauthorized", message: "Getting authorization token failed because permission denied (is the device in pairing mode?)"});
                  return;
        default:  reject({errorCode: "ErrorConnection", message: "Connection to \"" + address + ":" + port +  "\" failed: HTTP status code " + statusCode});
                  return;
      }

      let rawData = "";
      res.on("data", (chunk) => { rawData += chunk; });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(rawData);
          if (parsedData["auth_token"]) {
            resolve(parsedData["auth_token"]);
          }
          else {
            reject({errorCode: "NoAuthTokenFound", message: "No authorization token found!", messageDetail: "JSON response does not contain an \"auth_token\""});
          }
        }
        catch (err) {
          reject({errorCode: "NoAuthTokenFound", message: "No authorization token found!", messageDetail: "Error JSON parsing received data: " + err});
        }
      });
    });

    req.on("error", (err) => {
      reject({errorCode: "ErrorConnection", message: "Connection to \"" + address + ":" + port + "\" failed, " + err})
    });

    req.end();
  });
};
