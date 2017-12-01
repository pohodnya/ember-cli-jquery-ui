/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var Funnel = require('broccoli-funnel');
var Merge = require('broccoli-merge-trees');
var fastbootTransform = require('fastboot-transform');
var existSync = require('exists-sync');

module.exports = {
  name: 'ember-cli-jquery-ui',

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  treeForVendor(tree) {
    let trees = [];

    if (tree) {
      trees.push(tree);
    }

    const assetDir = path.join(app.bowerDirectory, 'jquery-ui');

    if (existSync(assetDir)) {
      const browserTrees = fastbootTransform(new Funnel(assetDir, {
        files: ['jquery-ui.js'],
        destDir: 'jquery-ui'
      }));
      trees.push(browserTrees);
    }

    return new Merge(trees);
  },

  included: function(app) {
    this._super.included(app);

    var options = app.options['ember-cli-jquery-ui'] || {};
    var theme = options.theme || "base";

    app.import('vendor/jquery-ui/jquery-ui.js');

    if (theme != 'none') {
      var cssFileDir = path.join(app.bowerDirectory, 'jquery-ui', 'themes', theme);
      var cssFiles = fs.readdirSync(cssFileDir);

      cssFiles.forEach(function(file) {
        if (/^.*\.css$/.test(file) && !/^.*\.min\.css$/.test(file))
          app.import(path.join(cssFileDir, file));
      });

      var imgFileDir = path.join(app.bowerDirectory, 'jquery-ui', 'themes', theme, 'images');
      var imgFiles = fs.readdirSync(imgFileDir);

      imgFiles.forEach(function(file) {
        app.import(path.join(imgFileDir, file), {
          destDir: "/assets/images"
        });
      });
    }
  }
};
