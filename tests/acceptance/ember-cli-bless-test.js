/*jshint quotmark: false*/

'use strict';

var assertFile = require('../helpers/assert-file');
var ember = require('../helpers/ember');
var path = require('path');
var root = process.cwd();
var tmp = require('tmp-sync');
var tmproot = path.join(root, 'tmp');
var writeFile = require('fs-extra').writeFileSync;
var Project = require('ember-cli/lib/models/project');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var fs = require("fs"),
  path = require("path");

var p = "./";

function listDir(dir) {
  fs.readdir(dir, function(err, files) {
    if (err) {
      throw err;
    }

    files.map(function(file) {
      return path.join(p, file);
    }).forEach(function(file) {
      console.log("%s (%s)", file, path.extname(file));
    });
  });

}

describe('Acceptance: ember ember-cli-bless', function() {
  var tmpdir, project, projectPath;
  this.timeout(10000);

  beforeEach(function() {
    tmpdir = tmp.in(tmproot);
    process.chdir(tmpdir);
  });

  function initApp(options) {
    var app = ember(['build'], options);
    // app.options.test= true;
    return app;
  }

  function blessCss(opts) {
    var optArgs = [],
      options = opts || {};
    return initApp(optArgs, options);
  }

  it('blesses files with selectors > 4096', function() {
    var app = new EmberApp({
      project: project
    });
    return blessCss({
      bless: {
        enabled: true
      }
    }).then(function() {
      // listDir('./dist/assets/');
      assertFile('dist/assets/dummy.css', {
        contains: [
          "@import url('dummy-blessed2.css",
          "@import url('dummy-blessed1.css"
        ]
      });
    });
  });

});
