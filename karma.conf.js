module.exports = function(config) {
  var configuration = {
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
    browsers: ['Chrome', 'Firefox', 'Safari', 'PhantomJS'],
    singleRun: true
  };

  // Only use Firefox and PhantomJS when running on Travis
  if (process.env.TRAVIS) {
    configuration.browsers = ['Firefox', 'PhantomJS'];
  }

  config.set(configuration);
};
