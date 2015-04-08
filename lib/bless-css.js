/*jshint node:true */
var bless = require('./bless-writer');
var pickFiles  = require('broccoli-static-compiler'); // TODO replace with funnel
var mergeTrees  = require('broccoli-merge-trees');

module.exports = function(tree, options) {
  var files = options.files || ['**/*.css'];

  var styles = pickFiles(tree, {
    srcDir: 'assets/',
    files: files,
    destDir: 'assets/'
  });

  return mergeTrees([tree, bless(styles, options)], { overwrite: true });
};
