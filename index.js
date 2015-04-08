/* jshint node: true */
'use strict';
var blessCss = require('./lib/bless-css.js');

module.exports = {
  name: 'ember-cli-bless',
  included: function(app) {
    this._super.included.apply(this, arguments);
    this.app = app;
    this.options = getOptions(this);
  },
  postprocessTree: function(type, tree) {
    if (type === 'css' && this.options.enabled  ) {
      tree = blessCss(tree, this.options || {});
    }
    return tree;
  }
};

module.exports.blessCss = blessCss;

function getOptions(addonContext) {
  var baseOptions = (addonContext.parent && addonContext.parent.options) || (addonContext.app && addonContext.app.options),
    options = baseOptions && baseOptions['bless'] || {
      cacheBuster: true,
      cleanup: true,
      compress: false,
      force: false,
      imports: true
    };
  return options;
}
