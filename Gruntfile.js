module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // concatenation for different distributions
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   <%= pkg.homepage %>\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Apache 2.0 License */\n\n'
      },

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
    },

    // uglification for browser distribution
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   <%= pkg.homepage %>\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Apache 2.0 License */\n\n'
      },
      browser: {
        files: {
          'dist/browser/geofaker.min.js': ['dist/browser/geofaker.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [
    'concat:browser',
    'uglify:browser',
    'concat:node'
  ]);

};
