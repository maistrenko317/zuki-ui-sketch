// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const {resolve} = require('path');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'mocha',
  mochaOpts: {},
  onPrepare() {
    require('ts-node').register({
      project: resolve(__dirname, './tsconfig.e2e.json')
    });
    require('tsconfig-paths').register()
  }
};
