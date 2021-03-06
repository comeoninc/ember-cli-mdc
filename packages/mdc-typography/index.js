'use strict';

module.exports = {
  name: 'ember-cli-mdc-typography',

  included (app) {
    this._super (...arguments);

    if (process.env.CORBER) {
      this.ui.writeLine ('Bundling Roboto fonts with the application.');

      // Import the font stylesheet.
      app.import ('vendor/assets/styles/roboto.css');

      // Import the Roboto fonts.
      app.import ('vendor/assets/fonts/roboto/Roboto-Bold.woff', {destDir: 'assets/fonts'});
      app.import ('vendor/assets/fonts/roboto/Roboto-Bold.woff2', {destDir: 'assets/fonts'});
      app.import ('vendor/assets/fonts/roboto/Roboto-Light.woff', {destDir: 'assets/fonts'});
      app.import ('vendor/assets/fonts/roboto/Roboto-Light.woff2', {destDir: 'assets/fonts'});
      app.import ('vendor/assets/fonts/roboto/Roboto-Medium.woff', {destDir: 'assets/fonts'});
      app.import ('vendor/assets/fonts/roboto/Roboto-Medium.woff2', {destDir: 'assets/fonts'});
      app.import ('vendor/assets/fonts/roboto/Roboto-Regular.woff', {destDir: 'assets/fonts'});
      app.import ('vendor/assets/fonts/roboto/Roboto-Regular.woff2', {destDir: 'assets/fonts'});
      app.import ('vendor/assets/fonts/roboto/Roboto-Thin.woff', {destDir: 'assets/fonts'});
      app.import ('vendor/assets/fonts/roboto/Roboto-Thin.woff2', {destDir: 'assets/fonts'});
    }
  },

  contentFor (type, config) {
    this._super (...arguments);

    if (type === 'head-footer') {
      if (!process.env.CORBER) {
        this.ui.writeLine ('Linking Roboto fonts with the application.');
        return '<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet" />';
      }
    }
  },

  optionsFor (type, options) {
    if (type === 'sass') {
      options.cacheInclude = options.cacheInclude || [];
      options.cacheInclude.push (/addon\.scss/);
      options.cacheInclude.push (/@material\/typography/);
    }

    return options;
  }
};
