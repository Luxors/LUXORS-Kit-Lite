'use strict';

var gulp        = require('gulp');  
var watch       = require('gulp-watch');
var plumber     = require('gulp-plumber'); //Prevent pipe breaking caused by errors from 
var rename      = require('gulp-rename');
var concat      = require('gulp-concat');
var sourcemaps  = require('gulp-sourcemaps');
var notify      = require("gulp-notify");
var del 		= require('del');
var rimraf      = require('rimraf'); //удаление ./dist перед деплоем (таск 'clean')
var pug         = require('gulp-pug');
var preproc     = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cssmin      = require('gulp-cssnano');
var gcmq        = require('gulp-group-css-media-queries');
var csso        = require('gulp-csso'); // CSS минификатор
var uglify      = require('gulp-uglifyjs'); //обрезание и минификация JavaScript
var jshint      = require('gulp-jshint'); // линтер
var imagemin    = require('gulp-imagemin');
var pngquant    = require('imagemin-pngquant');
var sprite      = require('gulp.spritesmith');
var cache       = require('gulp-cache');
var browserSync = require("browser-sync");


gulp.task('localserver', function() {
    	browserSync({
    		server: {
    			baseDir: './dist'
    		},
    		notify: false,
    		tunnel: false,
    		port: 9999,
    		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
    	});
    }
);

gulp.task('clean', function () {
        return del.sync('./dist');
    }
);
gulp.task('moving', function () {
	return gulp.src('app/libs/**')
		.pipe(gulp.dest('./dist/libs/'))
    }
);
gulp.task('html:build', function () {
    return gulp.src('app/index.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true}).on('error', notify.onError(
            {
                message: "<%= error.message %>",
                title  : "Pug Error!"
            }))
        )
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify({ message: 'Pug task complete' }));
    }
);

gulp.task('css:build', function () {
    return gulp.src('app/style.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(preproc().on('error', notify.onError(
            {
                message: "<%= error.message %>",
                title  : "Sass Error!"
            }))
        )
        .pipe(prefix(['last 15 versions']))
        .pipe(gcmq())
        .pipe(cssmin())
		.pipe(rename({
			basename: 'styles',
			suffix: '.min',
			extname: '.css'
    	}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/styles/'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(notify({ message: 'Styles task complete' }));
    }
);

gulp.task('js:build', function () {
    return gulp.src('app/blocks/**/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
		.pipe(concat('common.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/scripts/'))
        .pipe(browserSync.reload({stream: true}));
    }
);

gulp.task('sprite:build', function () {
    return gulp.src('app/images/sprites/*')
		.pipe(sprite({
                imgName: 'sprite.png',
                cssName: '../scss/_sprites.scss',
                cssFormat: 'scss',
                algorithm: 'binary-tree',
				padding: 5
            })
        )
        .pipe(gulp.dest('app/images'));
    }
);

gulp.task('img:build', function () {
    return gulp.src('app/images/*')
		.pipe(cache(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            }))
        )
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({stream: true}));
    }
);



gulp.task('fonts:build', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
    }
);

gulp.task('build',[
	'clean',
	'moving',
	'html:build',
	'js:build',
	'css:build',
	'fonts:build',
	'img:build'
]);


gulp.task('watch',['localserver','html:build','css:build','js:build','fonts:build','img:build'],
	function() {
    	gulp.watch('app/**/**/*.pug', ['html:build']);
    	gulp.watch('app/**/**/*.scss', ['css:build']);
    	gulp.watch('app/**/**/*.js', ['js:build']);
    	gulp.watch('app/img/**/*', ['img:build']);
    	gulp.watch('app/fonts/**/*', ['fonts:build']);
    }
);


gulp.task('default', ['build', 'localserver', 'watch']);

