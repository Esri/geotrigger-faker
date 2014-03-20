module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
          'geotrigger-faker.min.js': ['geotrigger-faker.js']
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['spec/fakerSpec.js']
      }
    },


    karma: {
      test: {
        configFile: 'karma.conf.js'
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('build', ['uglify:browser']);

  grunt.registerTask('test', [
    'mochaTest',
    'karma'
  ]);

  grunt.registerTask('default', ['build']);

};
