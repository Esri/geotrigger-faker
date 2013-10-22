module.exports = function(grunt) {

  grunt.initConfig({

    // concatenation for different distributions
    concat: {

      // Browser distribution
      browser: {
        src: [
          'src/browser/header.js',
          'src/geofaker.js',
          'src/browser/footer.js'
        ],
        dest: 'dist/browser/geofaker.js'
      },

      // Node distribution
      node: {
        src: [
          'src/node/header.js',
          'src/geofaker.js',
          'src/node/footer.js'
        ],
        dest: 'geofaker.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', [
    'concat:browser',
    'concat:node'
  ]);

};