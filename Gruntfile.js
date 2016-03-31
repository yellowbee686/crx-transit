module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      default: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: 'js/*.js',
          dest: 'build/'
        }]
      }
    },
    uglify: {
      default: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: 'js/*.js',
          dest: 'build/'
        }]
      }
    },
    sass: {
      options: {
        sourcemap: 'none'
      },
      default: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: 'css/*.scss',
          dest: 'build/',
          ext: '.css'
        }]
      }
    },
    copy: {
      default: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'fonts/*',
            'img/**/*',
            '*.html',
            'manifest.json'
          ],
          dest: 'build/'
        }]
      }
    },
    watch: {
      scripts: {
        files: ['src/js/**/*.js'],
        tasks: ['browserify'],
      },
      styles: {
        files: ['src/css/**/*'],
        tasks: ['sass'],
      },
      static: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'fonts/*',
            'img/**/*',
            '*.html',
            'manifest.json'
          ]
        }],
        tasks: ['copy']
      }
    }
    // jshint: {
    //   files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
    //   options: {
    //     globals: {
    //       jQuery: true
    //     }
    //   }
    // },
    // watch: {
    //   files: ['<%= jshint.files %>'],
    //   tasks: ['jshint']
    // }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['browserify', 'sass', 'copy']);
};