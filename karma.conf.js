module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'node_modules/geotrigger-js/geotrigger.js',
      'geotrigger-faker.js',
      'spec/config.js',
      'spec/**/*Spec.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
