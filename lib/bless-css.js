/*jshint node:true */
var bless = require('./bless-writer');
var pickFiles  = require('broccoli-static-compiler'); // TODO replace with funnel
var mergeTrees  = require('broccoli-merge-trees');

module.exports = function(tree, options) {
  var files = options.files || ['**/*.css'];
  var srcDir = options.srcDir || 'assets/';
  var destDir = options.destDir || 'assets/';

  var styles = pickFiles(tree, {
    srcDir: srcDir,
    files: files,
    destDir: destDir
  });

  return mergeTrees([tree, bless(styles, options)], { overwrite: true });
};
