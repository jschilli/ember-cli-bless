'use strict';

var MockUI        = require('./mock-ui');
var MockAnalytics = require('./mock-analytics');
var Cli           = require('ember-cli/lib/cli');
var merge         = require('lodash').merge;
var baseArgs = ['node', 'path/to/cli'];

module.exports = function ember(args, options) {
  var argv, cli;

  if (args) {
    argv = baseArgs.slice().concat(args);
  } else {
    argv = baseArgs;
  }

  cli = new Cli(merge(options, {
    inputStream:  [],
    outputStream: [],
    cliArgs:      args,
    Leek: MockAnalytics,
    UI: MockUI,
    testing: true
  }));

  return cli;
};
