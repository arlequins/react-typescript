const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const notify = require('gulp-notify')
const livereload = require('gulp-livereload')
const targetIndex = './server/index.js'
 
// Task
gulp.task('default',() => {
	livereload.listen()
	nodemon({
		script: targetIndex,
		ext: 'js'
	}).on('restart', () => {
		gulp.src(targetIndex)
			.pipe(livereload())
			.pipe(notify('Reloading page, please wait...'))
	})
})
