'use strict';

module.exports = {
  name: 'ember-cli-mdc-base',

  included (app) {
    this._super (...arguments);

    app.import ({
      development: 'node_modules/@material/base/dist/mdc.base.js',
      production: 'node_modules/@material/base/dist/mdc.base.min.js'
    });
  }
};
