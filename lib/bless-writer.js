/*jshint node:true */
var fs = require('fs');
var RSVP = require('rsvp');
var path = require('path');
var mkdirpSync = require('fs-extra').mkdirpSync;
var Writer = require('broccoli-caching-writer');
var walkSync = require('walk-sync');
var mapSeries = require('promise-map-series');
var bless = require('bless');
var copyDereferenceSync = require('copy-dereference').sync;

module.exports = BlessWriter;

BlessWriter.prototype = Object.create(Writer.prototype);
BlessWriter.prototype.constructor = BlessWriter;

function BlessWriter(inputTree, options) {
  if (!(this instanceof BlessWriter)) {
    return new BlessWriter(inputTree, options);
  }
  Writer.apply(this, arguments);
  this.options = options;
}

BlessWriter.prototype.updateCache = function(inSrcDir, inDestDir) {
  var srcDir = inSrcDir[0];
  var destDir = inDestDir;
  var self = this;
  var paths = walkSync(srcDir);

  return mapSeries(paths, function(relativePath) {
    if (/\/$/.test(relativePath)) {
      var destPath = destDir + '/' + relativePath;
      mkdirpSync(destPath);
    } else {
      copyDereferenceSync(
        path.join(srcDir, relativePath),
        path.join(destDir, relativePath)
      );

      if (/\.css$/.test(relativePath)) {
        var srcPath = path.join(srcDir, relativePath);

        var rawcss = fs.readFileSync(srcPath, {
          encoding: 'utf8'
        });

        self.bless(rawcss, relativePath, self.options).then(function(outputs) {
        outputs.forEach(function(output) {
            var finalDestPath = path.join(destDir, output.filename);
            fs.writeFileSync(finalDestPath, output.content, {
              encoding: 'utf8'
            });

        });
          // for (var i = 0; i < outputs.length; i++) {
          // }
        }, function(error) {
          console.log('error:', error);
        });
      }
    }
  });
};

BlessWriter.prototype.bless = function(contents, output, options) {
  var blessor = new(bless.Parser)({
    output: output,
    options: options
  });
  var parser = RSVP.denodeify(blessor.parse, true); // turn into a promise and ask for all callback params

  return parser(contents).then(function(results) {
    var blessedFiles = results[0];
    var numSelectors = results[1];
    if (options.log) {
      // print log message
      var msg = 'Found ' + numSelectors + ' selector' + (numSelectors === 1 ? '' : 's') + ', ';
      if (blessedFiles.length > 1) {
        msg += 'splitting into ' + blessedFiles.length + ' blessedFiles.';
      } else {
        msg += 'not splitting.';
      }
      console.log(msg);
    }

    // write processed file(s)
    return blessedFiles;

  }, function(err) {
    throw new Error(err);
  });
};
