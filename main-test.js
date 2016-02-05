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

function calls(name, contract, collaboration) {
  if (collaboration === undefined) {
    collaboration = contract;
    contract = _.noop;
  }
  var context = {};
  var contractName = id(name);
  calls.stubContract(contractName, contract.bind(context));
  calls.addCollaborationCheck(contractName, collaboration.bind(context));
}

_.assign(calls, {
  _pending: [],
  _collaborations: [],
  stubContract: function(names, fn) {
    this._pending = this._pending.concat(names);
    fn();
  },
  addCollaborationCheck: function(names, fn) {
    this._collaborations.push(function() {
      this._pending = _.difference(this._pending, [].concat(names));
      return fn();
    }.bind(this));
  },
  run: function() {
    var self = this;
    return Promise
      .each(self._collaborations, function(collaboration) {
        return collaboration();
      })
      .then(function() {
        self._collaborations = [];
        expect(self._pending).to.eql([]);
      });
  },
});
_.bindAll(calls);
global.calls = calls;
