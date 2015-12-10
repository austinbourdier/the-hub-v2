module.exports = function(grunt) {

  grunt.initConfig({
  	wiredep: {

	    task: {

		    // Point to the files that should be updated when
		    // you run `grunt wiredep`
		    src: [
		      './views/index.html',   // .html support...
		    ],

		    options: {
		    	ignorePath: '../public/'
		      // See wiredep's configuration documentation for the options
		      // you may pass:

		      // https://github.com/taptapship/wiredep#configuration
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

  // load nodemon
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-wiredep');

  // register the nodemon task when we run grunt
  grunt.registerTask('serve', ['jshint', 'wiredep', 'nodemon']);  

};