'use strict';

var lodash = require('lodash');
var bluebird = require('bluebird');
var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var sinonAsPromised = require('sinon-as-promised');

chai.use(sinonChai);
chai.use(chaiAsPromised);
sinonAsPromised(bluebird);

global._ = lodash;
global.Promise = bluebird;
global.expect = chai.expect;
global.spy = sinon.spy;
global.stub = sinon.stub;
global.mock = sinon.mock;
global.id = function (name) {
  return 'id[' + name + ',' + Math.random() + ']';
};
