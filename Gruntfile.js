module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      browser: {
        src: [
          'src/browser/header.js',
          'src/geofaker.js',
          'src/browser/footer.js'
        ],
        dest: 'dist/browser/geofaker.js'
      },
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

  grunt.registerTask('dist', [
    'concat:browser',
    'concat:node'
  ]);

};