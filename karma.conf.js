// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-html-reporter'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-scss-preprocessor'),
      require('karma-junit-reporter'),
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    
    reporters: ['progress', 'kjhtml', 'html', 'junit'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 50000,
    browsers: ['Chrome'],
    singleRun: false,
    files: [
      { pattern: './src/assets/js/vendor/moment.js', watched: false, included: true },
      { pattern: './src/assets/js/vendor/hammer.min.js', watched: false, included: true },
      // { pattern: './node_modules/marked/lib/marked.js', watched: false, included: true },
      
      { pattern: './node_modules/@angular/material/prebuilt-themes/indigo-pink.css', watched: false,  included: false ,served: true},
      { pattern: './src/styles.scss', watched: false,  included: true, served: true },
      "node_modules/font-awesome/css/font-awesome.css",
      {
        pattern: 'node_modules/font-awesome/fonts/*',
        watched: false,
        included: false,
        served: true,
        nocache: false
      }
    ],
    preprocessors: {
      
      './src/styles.scss': ['scss']
    },
    htmlReporter: {
      outputDir: 'dist/tests/html',
      templatePath: null,
      focusOnFailures: true,
      namedFiles: false,
      pageTitle: null,
      urlFriendlyName: false,
      reportName: 'test-results',
      preserveDescribeNesting: false,
      foldAll: false,
    },
    junitReporter: {
       outputDir: 'dist/tests/xml',
       outputFile: 'test-results.xml',
       suite: '',
       useBrowserName: false
    },
  });
};
