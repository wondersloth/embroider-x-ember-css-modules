'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  // const shouldUseEmbroider = false;

  let app = new EmberAddon(defaults, {
    cssModules: {
      intermediateOutputPath: 'app/styles/_css-modules.css',
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  // if (shouldUseEmbroider) {
  //   const { Webpack } = require('@embroider/webpack');
  //   return require('@embroider/compat').compatBuild(app, Webpack, {
  //     skipBabel: [
  //       {
  //         package: 'qunit',
  //       },
  //     ],
  //   });
  // }

  return app.toTree();
};
