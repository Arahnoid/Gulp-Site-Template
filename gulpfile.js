// Required Node pluggins
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    autoprefixer  = require('gulp-autoprefixer'),
    changed = require('gulp-changed'),
    flatten = require('gulp-flatten'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass');


// Project folders
var $ = {
    src:{
        root: './App',
        sass:'./App/sass/**/*.sass',
        js: './App/js/**/*.js',
        html: './App/*.html'
    },
    dest:{
        css:'./App/css/'
    }
};


// Error handle function
var displayError = function(error) {

    var errorString = '[' + error.plugin + ']';
    errorString += ' ' + error.message.replace("\n",'');

    if(error.fileName) {
        errorString += ' in ' + error.fileName;
    }
    if(error.lineNumber) {
        errorString += ' on line ' + error.lineNumber;
    }

    console.error( errorString );
    beeper('*');
};


gulp.task('sass', function() {
    gulp.src($.src.sass)
        .pipe(plumber({errorHandler:function(err) { displayError(err); }}))
        .pipe(sass({
            indentedSyntax: true,
            sourceComments: 'map',
            sourceMap: 'sass',
            outputStyle: 'nested' }))
        .pipe(autoprefixer('last 2 version', '> 1%', 'ie 8', 'ie 9', 'ios 6', 'android 4'))
        .pipe(flatten())
        .pipe(changed($.dest.css, { extension: '.css', hasChanged: changed.compareSha1Digest }))
        .pipe(gulp.dest($.dest.css))
        .pipe(notify({title:'SAAS', message: '.......<%= file.relative %>'}));
});


// Run task and reload browser
gulp.task( 'sass-watch', ['sass'], browserSync.reload );
gulp.task( 'js-watch', browserSync.reload );
gulp.task( 'html-watch', browserSync.reload );


// Watch files for changes
gulp.task('default', function(){
    // Create server
    browserSync({ server: { baseDir: [$.src.root]}});

    // Watch files
    watch([$.src.sass], function() { gulp.start('sass-watch'); });
    watch([$.src.html], function() { gulp.start('html-watch'); });
    watch([$.src.js], function() { gulp.start('js-watch'); });
});
