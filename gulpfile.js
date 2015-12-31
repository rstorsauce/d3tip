'use strict';

var gulp = require('gulp');
var typescript = require('gulp-tsc');
var sass = require('gulp-sass');
var clean = require('gulp-clean');

gulp.task('clean', () => {
	return gulp.src('./dist/**/*', {read: false})
		.pipe(clean());
});

gulp.task('copy', () => {
	return gulp.src(['./src/**/*', '!./src/typings/**', '!./src/**/*.ts', '!./src/**/*.scss'])
		.pipe(gulp.dest('./dist'));
})

gulp.task('typescript', () => {
	return gulp.src(['./src/**/*.ts', '!./src/typings/**'])
		.pipe(typescript({
			module: "commonjs",
			target: "es5",
			sourceMap: true,
			declaration: true,
			removeComments: true,
			noImplicitAny: false,
			experimentalDecorators: true,
			emitDecoratorMetadata: true
		}))
		.pipe(gulp.dest('./dist'))
		.on('error', () => console.log('...'));
});

gulp.task('sass', () => {
	return gulp.src('./src/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist'));
});

gulp.task('build', ['clean', 'typescript', 'sass', 'copy']);