'use strict';
// TODO : fix dist
var gulp = require('gulp'),
        prefix = require('gulp-autoprefixer'),
        browserSync = require('browser-sync').create(),
        browserify = require('gulp-browserify'),
        wiredep = require('wiredep').stream,
        runSequence = require('run-sequence'),
        useref = require('gulp-useref'),
        del = require('del'),
        gaze = require('gaze'),
        path = require('path'),
        transform = require('vinyl-transform'),
        source = require('vinyl-source-stream'),
        buffer = require('vinyl-buffer'),
        $ = require('gulp-load-plugins')();

// Paths
var paths = {
    tmp: ".tmp/",
    src: "src/",
    dist: "docs/"
}

// Options
var browserifyOpts = {
    debug: true,
    standalone: 'shared'
};
var browserifyOptsProd = {
    debug: false,
    standalone: 'shared'
};

var wiredepOptions = {
    directory: 'bower_components'
};

var injectOptions = {
    ignorePath: ['.tmp/', 'dist/', 'docs/'],
    addRootSlash: false
};

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'js'], function () {

    browserSync.init({
        server: './',
        browser: "google chrome"
    });

    gulp.watch(paths.src + 'scss/**/*.scss', ['sass']);
    gulp.watch(paths.src + 'js/**/*.js', ['js:browserify']);
    gulp.watch('./*.html').on('change', browserSync.reload);
});

// Configure CSS tasks.
gulp.task('sass', function () {
    return gulp.src(paths.src + 'scss/**/*.scss')
            .pipe($.sourcemaps.init())
            .pipe($.sass.sync().on('error', $.sass.logError))
            .pipe(prefix('last 2 versions'))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest(paths.tmp + 'css'))
            .pipe(browserSync.stream());
});
gulp.task('sass:dist', function () {
    return gulp.src(paths.src + 'scss/**/*.scss')
            .pipe($.sass.sync().on('error', $.sass.logError))
            .pipe(prefix('last 2 versions'))
            .pipe($.cssmin())
            .pipe($.concat('app.css'))
            .pipe($.rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest(paths.dist + 'css'))
            .pipe(browserSync.stream());
});

// Configure JS.
gulp.task('js:dist', function () {
       console.log(gulp.dest);
       console.log(gulp.dest);
    return gulp.src(paths.src + 'js/app.js')
            .pipe(browserify(browserifyOptsProd))
            .pipe(buffer())
            .pipe($.uglify())
            .pipe($.rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest(paths.dist + 'js'));
   
});

gulp.task("js:browserify", function () {
    return gulp.src(paths.src + 'js/app.js')
            .pipe(browserify(browserifyOpts))
            .pipe(gulp.dest(paths.tmp + 'js'));
});

// Configure image stuff.
gulp.task('images', function () {
    return gulp.src(paths.src + 'assets/images/**/*.+(png|jpg|gif|svg)')
            .pipe($.imagemin())
            .pipe(gulp.dest(paths.tmp + 'assets/images'));
});
gulp.task('images:dist', function () {
    return gulp.src(paths.src + 'assets/images/**/*.+(png|jpg|gif|svg)')
            .pipe($.imagemin())
            .pipe(gulp.dest(paths.dist + 'assets/images'));
});

gulp.task('moveJs', function () {
    return gulp.src(paths.src + 'library/**/*')
            .pipe(gulp.dest(paths.tmp + 'library'));
});
gulp.task('moveJs:dist', function () {
    return gulp.src(paths.src + 'library/**/*')
            .pipe(gulp.dest(paths.dist + 'library'));
});
gulp.task('moveData:dist', function () {
    return gulp.src(paths.src + 'data/**/*')
            .pipe(gulp.dest(paths.dist + 'data'));
});
gulp.task('moveAssets', function () {
    return gulp.src(paths.src + 'assets/**/*')
            .pipe(gulp.dest(paths.tmp + 'assets'));
});
gulp.task('moveData', function () {
    return gulp.src(paths.src + 'data/**/*')
            .pipe(gulp.dest(paths.tmp + 'data'));
});
gulp.task('font:dist', function () {
    return gulp.src(paths.src + 'assets/fonts/**/*.+(eot|eot?#iefix|woff2|woff|ttf|svg)')
            .pipe(gulp.dest(paths.dist + 'assets/fonts'));
});

gulp.task('watch', function () {
    var handleDelete = function (pathToDel) {
        var filePathFromSrc = path.relative(path.resolve(paths.src), pathToDel);
        var destFilePath = path.resolve(paths.tmp, filePathFromSrc);
        del.sync(destFilePath);
    }

    gulp.watch(paths.src + 'scss/**/*.scss', function (event) {
        if (event.type == 'changed') {
            gulp.start('sass');
        } else if (event.type === 'deleted') {
            handleDelete(event.path);
        } else {
            runSequence('sass', 'inject')
        }
    });
    gulp.watch(paths.src + 'js/**/*.js', function (event) {
        if (event.type == 'changed') {
            gulp.start('js:browserify');
        } else if (event.type === 'deleted') {
            handleDelete(event.path);
        } else {
            runSequence('js:browserify', 'inject')
        }
    });
    gulp.watch(paths.src + '**/*.html', function (event) {
        if (event.type === 'deleted') {
            handleDelete(event.path);
        } else {
            // temp
            gulp.start('move');
            setTimeout(function () {
                gulp.start('inject');
            }, 800);
        }
    });
    gulp.watch(paths.src + 'assets/**/*.*', function (event) {
        if (event.type === 'deleted') {
            handleDelete(event.path);
        } else {
            runSequence('moveAssets')
        }
    });
});

gulp.task('inject', function () {
    var injectStyles = gulp.src([
        // selects all css files from the .tmp dir
        paths.tmp + '/**/*.css',
        // but ignores css files in the library
        '!' + paths.tmp + 'library/css/**/*.*'
    ], {
        read: false
    });

    var injectScripts = gulp.src([
        // selects all js files from .tmp dir
        paths.tmp + '/**/*.js',
        // but ignores test & library files
        '!' + paths.tmp + '/**/*.test.js',
        '!' + paths.tmp + 'library/js/**/*.js'
    ]);

    return gulp.src(paths.tmp + '*.html')
            .pipe($.inject(injectStyles, injectOptions))
            .pipe($.inject(injectScripts, injectOptions))
            // write the injections to the .tmp/index.html file
            .pipe(gulp.dest(paths.tmp));
});
gulp.task('inject:dist', function () {
    var injectStyles = gulp.src([
        // selects all css files from the .tmp dir
        paths.dist + '/**/*.css',
        // but ignores test & library files
        '!' + paths.dist + 'library/**/**/*.*'
    ], {
        read: false
    });

    var injectScripts = gulp.src([
        // selects all js files from .tmp dir
        paths.dist + '/**/*.js',
        // but ignores test & library files
        '!' + paths.dist + '/**/*.test.js',
        '!' + paths.dist + 'library/js/**/*.js'
    ]);

    return gulp.src(paths.tmp + '*.html')
            .pipe($.inject(injectStyles, injectOptions))
            .pipe($.inject(injectScripts, injectOptions))
            // write the injections to the .tmp/index.html file
            .pipe(gulp.dest(paths.dist));
});
gulp.task('useref:dist', function () {
    return gulp.src(paths.dist + '*.html')
            .pipe(useref())
            .pipe(gulp.dest(paths.dist));
});

gulp.task('clean', function () {
    return del([
        paths.tmp + '**/*'
    ]);
});

gulp.task('clean:dist', function () {
    return del([
        paths.dist + '**/*'
    ]);
});

gulp.task('move', function () {
    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    gulp.src(paths.src + '**/*.html', {
        base: paths.src
    })
            .pipe(gulp.dest(paths.tmp));
});
gulp.task('move:dist', function () {
    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    gulp.src(paths.src + '**/*.html', {
        base: paths.src
    })
            .pipe(gulp.dest(paths.dist));
});

//gulp.task('default', ['move', 'sass', 'js:browserify', 'images', 'inject']);
//
gulp.task('default', function (callback) {
    runSequence('clean', ['move', 'sass', 'moveAssets','moveData'],
            'moveJs',
            'js:browserify',
            'inject',
            callback);
});
gulp.task('prod', function (callback) {
    runSequence('clean:dist', ['move:dist', 'sass:dist', 'images:dist', 'font:dist'],
            'moveJs:dist',
            'moveData:dist',
            'js:dist',
            'inject:dist',
            'useref:dist',
            callback);
});
