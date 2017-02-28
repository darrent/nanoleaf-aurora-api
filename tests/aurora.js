const should = require('should'),
  sinon = require('sinon'),
  http = require('http'),
  assert = require('assert'),
  nock = require('nock'),
  AuroraApi = require('../lib/aurora');

function getOptions() {
  return {
    host: '192.168.1.160',
    base: '/api/beta/',
    port: '16021',
    accessToken: 'TOKEN'
  };
}

const options = getOptions();
const api = new AuroraApi(options);

describe('Aurora Api tests:', () => {
  describe('Constructor', () => {
    it('should throw error when options are missing', () => {
      (() => {
        var auroraApi = new AuroraApi();
      }).should.throw('Missing options');
    });

    it('should throw error when host is missing', () => {
      var options = getOptions();
      delete options.host;
      (() => {
        var auroraApi = new AuroraApi(options);
      }).should.throw('Missing \'host\' property');
    });

    it('should throw error when base is missing', () => {
      var options = getOptions();
      delete options.base;
      (() => {
        var auroraApi = new AuroraApi(options);
      }).should.throw('Missing \'base\' property');
    });

    it('should throw error when access token is missing', () => {
      var options = getOptions();
      delete options.accessToken;
      (() => {
        var auroraApi = new AuroraApi(options);
      }).should.throw('Missing \'accessToken\' property');
    });

    it('should assign a default protocol', () => {
      api.protocol.should.equal('http:');
    });

  });

  describe('Api', () => {

    describe('Info', () => {
      it('should request', () => {
        const expectedInfo = {
          version: '1.0'
        };

        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/`)
          .reply(200, expectedInfo);

        api.getInfo().should.be.fulfilled(expectedInfo);
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/`)
          .reply(500);

        api.getInfo().should.be.rejected();
        request.done();
      });
    });

    describe('Power status', () => {
      it('should request', () => {
        const expectedPowerStatus = {
          value: true
        };
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/state/on`)
          .reply(200, expectedPowerStatus);

        api.getPowerStatus().should.be.fulfilled();
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/state/on`)
          .reply(500);

        api.getPowerStatus().should.be.rejected();
        request.done();
      });

    });

    describe('Turn on', () => {
      it('should request', () => {
        const body = JSON.stringify({
          value: true
        });

        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/state/on`, body)
          .reply(200);

        api.turnOn().should.be.fulfilled();
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/state/on`, {
            value: true
          })
          .reply(500);

        api.turnOn().should.be.rejected();
        request.done();
      });
    });

    describe('Turn off', () => {
      it('should request', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/state/on`, {
            value: false
          })
          .reply(200);

        api.turnOff().should.be.fulfilled();
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/state/on`, {
            value: false
          })
          .reply(500);

        api.turnOff().should.be.rejected();
        request.done();
      });
    });

    describe('Get brightness', () => {
      it('should request', () => {
        const expectedBrightness = {
          'value': 100,
          'max': 100,
          'min': 0
        };
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/state/brightness`)
          .reply(200, expectedBrightness);

        api.getBrightness().should.be.fulfilled(expectedBrightness);
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/state/brightness`)
          .reply(500);

        api.getBrightness().should.be.rejected();
        request.done();
      });
    });

    describe('Set brightness', () => {
      it('should request', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/state/brightness`, {
            'brightness': 100
          })
          .reply(200);

        api.setBrightness(100).should.be.fulfilled();
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/state/brightness`, {
            'brightness': 100
          })
          .reply(500);

        api.setBrightness(100).should.be.rejected();
        request.done();
      });
    });

    describe('Get hue', () => {
      it('should request', () => {
        const expectedHue = {
          'value': 100,
          'max': 360,
          'min': 0
        };
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/state/hue`)
          .reply(200, expectedHue);

        api.getHue().should.be.fulfilled(expectedHue);
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/state/hue`)
          .reply(500);

        api.getHue().should.be.rejected();
        request.done();
      });
    });

    describe('Set hue', () => {
      it('should request', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/state/hue`, {
            'hue': 120
          })
          .reply(200);

        api.setHue(120).should.be.fulfilled();
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/state/hue`)
          .reply(500);

        api.setHue(120).should.be.rejected();
        request.done();
      });
    });

    describe('Get colour temperature', () => {
      it('should request', () => {
        const expectedColourTemperature = {
          'value': 4000,
          'max': 100,
          'min': 0
        };
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/state/ct`)
          .reply(200, expectedColourTemperature);

        api.getColourTemperature().should.be.fulfilled(expectedColourTemperature);
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/state/ct`)
          .reply(500);

        api.getColourTemperature().should.be.rejected();
        request.done();
      });
    });

    describe('Set colour temperature', () => {
      it('should request', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/state/ct`, {
            'ct': 2000
          })
          .reply(200);

        api.setColourTemperature(2000).should.be.fulfilled();
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/state/ct`)
          .reply(500);

        api.setColourTemperature(2000).should.be.rejected();
        request.done();
      });
    });

    describe('Get colour mode', () => {
      it('should request', () => {
        const expectedColourMode = 'ct';

        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/state/colorMode`)
          .reply(200, expectedColourMode);

        api.getColourMode().should.be.fulfilled(expectedColourMode);
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/state/colorMode`)
          .reply(500);

        api.getColourMode().should.be.rejected();
        request.done();
      });
    });

    describe('Get effect', () => {
      it('should request', () => {
        const expectedEffect = {
          hello: 'Nemo'
        };
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/effects/select`)
          .reply(200, expectedEffect);

        api.getEffect().should.be.fulfilled(expectedEffect);
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/effects/select`)
          .reply(500);

        api.getEffect().should.be.rejected();
        request.done();
      });
    });

    describe('Select effect', () => {
      it('should request', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/effects`, {
            select: 'New Affect'
          })
          .reply(200);

        api.selectEffect('New Affect').should.be.fulfilled();
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/effects`, {
            select: 'New Affect'
          })
          .reply(500);

        api.selectEffect('New Affect').should.be.rejected();
        request.done();
      });
    });

    describe('List effect', () => {
      it('should request', () => {
        const expectedEffects = [
          'Color Burst',
          'Flames',
          'Forest',
          'Inner Peace',
          'Nemo',
          'Northern Lights',
          'Romantic',
          'Snowfall'
        ];

        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/effects/list`)
          .reply(200, expectedEffects);

        api.listEffects().should.be.fulfilled(expectedEffects);
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/effects/list`)
          .reply(500);

        api.listEffects().should.be.rejected();
        request.done();
      });
    });

    describe('Orientation', () => {
      it('should request', () => {
        const expectedOrientation = {
          'value': 0,
          'max': 360,
          'min': 0
        };

        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/panelLayout/globalOrientation`)
          .reply(200, expectedOrientation);

        api.getOrientation().should.be.fulfilled(expectedOrientation);
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/panelLayout/globalOrientation`)
          .reply(500);

        api.getOrientation().should.be.rejected();
        request.done();
      });
    });

    describe('Layout', () => {
      it('should request', () => {
        const expectedLayout = {
          'version': '1.0',
          'layoutData': '6 150 9 -74 43 60 49 -74 129 120 200 -149 173 180 122 -149 259 360 33 -224 303 300 192 -299 259 240'
        };

        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/panelLayout/layout`)
          .reply(200, expectedLayout);

        api.getLayoutOptions().should.be.fulfilled(expectedLayout);
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .get(`${options.base}${options.accessToken}/panelLayout/layout`)
          .reply(500);

        api.getLayoutOptions().should.be.rejected();
        request.done();
      });
    });

    describe('Identify', () => {
      it('should request', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/identify`)
          .reply(200);

        api.identify().should.be.fulfilled();
        request.done();
      });

      it('should reject when request fails', () => {
        const request = nock(`http://${options.host}:${options.port}`)
          .put(`${options.base}${options.accessToken}/identify`)
          .reply(500);

        api.identify().should.be.rejected();
        request.done();
      });
    });

  });
});