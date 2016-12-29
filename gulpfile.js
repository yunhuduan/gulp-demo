var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

var config = {
    dev:{

    },
    prod:{

    }
};

gulp.task('clean',function(){
   return gulp.src('dist',{read:false}).pipe(clean());
});

gulp.task('server',function(){
    connect.server({
        name:'html dev test',
        root:['dist'],
        port:8080,
        livereload:true
    })
});
//=============================================================
gulp.task('sass:dev',function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('./dist/css/'));
});
gulp.task('sass:build',function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('sass:watch',function () {
    return gulp.watch('src/sass/*.scss',['sass:dev']);
});
//=============================================================
gulp.task('script:dev',function () {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('script:build',function () {
    return gulp.src('src/js/**/*.js')
        .pipe(stripDebug())
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('script:watch',function () {
    return gulp.watch('src/js/**/*.js',['script:dev']);
});
//=============================================================
gulp.task('html',function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist')).pipe(connect.reload());
});

gulp.task('html:watch',function () {
    return gulp.watch('src/**/*.html',['html']);
});

//=============================================================

gulp.task('dev',function(callback){
    runSequence('clean',['sass:dev','script:dev','html','script:watch','sass:watch','html:watch'],'server',callback);
});

gulp.task('build',function(callback){
    runSequence('clean',['sass:build','script:build','html'],'server',callback);
});


