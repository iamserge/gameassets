module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '../js/',
          src: '*.js',
          dest: '../js/'
        }]
      }
    },

    jshint: {
      files: ['../partials/js/**/*.js'],
      options: {
        browser: true,
        esversion: 3,
        eqeqeq: false,
        devel: false,
        globals: {
          Salmon: true,
          App: true,
          jQuery: true,
          Configuration: true,
          Game: true,
          cmDisplayRecs: true,
          ko: true,
          JSON: true,
          PluckSDK: true,
          Adoro: true,
          Cufon: true,
          cmCreatePageviewTag: true,
          ActiveXObject: false,
          google: true,
          cmRecRequest: true,
          HomeFranchises: true,
          LimelightPlayer: true
        },
        strict: false,
        sub: false,
        undef: true,
        unused: false,
        jquery: true,
        supernew: true
      }
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '../partials/css',
          flatten: true,
          src: ['**/*.scss'],
          dest: '../css',
          ext: '.css'
        }]
      },
      options: {
        style: 'compressed'
      }
    },

    watch: {
      files: ['../partials/css/pages/**/*.scss', '../partials/css/global/**/*.scss', '../partials/js/pages/**/*.js', '../partials/js/global/*.js'],
      tasks: ['bundleAssets']
    }
  });



  grunt.registerTask("prepareModules", "Finds and prepares modules for concatenation.", function() {

    // get all module directories
    grunt.file.expand("../partials/js/pages/*").forEach(function(dir) {

      // get the module name from the directory name
      var dirName = dir.substr(dir.lastIndexOf('/') + 1);

      // get the current concat object from initConfig
      var concat = grunt.config.get('concat') || {};

      // create a subtask for each module, find all src files
      // and combine into a single js file per module
      concat[dirName] = {
        src: [dir + '/**/*.js'],
        dest: '../js/' + dirName + '.min.js'
      };

      // add module subtasks to the concat task in initConfig
      grunt.config.set('concat', concat);
    });
    
    var concat = grunt.config.get('concat') || {};
    concat['global'] = {
      src: ['../partials/js/global/Salmon.Global.UIBlocker.js','../partials/js/global/*.js'],
      dest: '../js/global.min.js'
    };
    grunt.config.set('concat', concat);

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('my-sass', ['sass']);

  grunt.registerTask('bundleAssets', ['prepareModules', 'concat', 'uglify']);
  grunt.registerTask('watchAssets', ['bundleAssets', 'watch']);
}; 