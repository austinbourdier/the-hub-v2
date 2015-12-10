module.exports = function(grunt) {

  grunt.initConfig({
  	mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['./test/**/*.js']
      }
    },
  	wiredep: {
	    task: {
		    src: [
		      './views/index.html',
		    ],

		    options: {
		    	ignorePath: '../public/'
		    }
	  	}
	},
	jshint: {
      all: ['Gruntfile.js', 'app.js'] 
    },

    // configure nodemon
    nodemon: {
      dev: {
        script: 'app.js'
      }
    }

  });

  // load tasks
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-mocha-test');

  // register the tasks that should be ran when initializing the server
  grunt.registerTask('serve', ['mochaTest', 'jshint', 'wiredep', 'nodemon']);  

};