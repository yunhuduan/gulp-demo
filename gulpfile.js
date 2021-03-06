var gulp = require('gulp');
var concat = require('gulp-concat');//合并
var sass = require('gulp-sass');//sass编译
var uglify = require('gulp-uglify');//压缩混淆
var connect = require('gulp-connect');//静态服务器
var clean = require('gulp-clean');//清理
var runSequence = require('run-sequence');//执行顺序
var stripDebug = require('gulp-strip-debug');//Strip console, alert, and debugger statements from JavaScript code with strip-debug
var livereload = require('gulp-livereload');//实时刷新
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');//gulp plugin to minify CSS,
var gulpif = require('gulp-if');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

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
        root:['./dist'],
        port:8080,
        livereload:true
    })
});
//=============================================================
gulp.task('sass:dev',function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(concat('all.css'))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(connect.reload());
});
gulp.task('sass:build',function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(concat('all.css'))
        .pipe(cleanCSS())
        .pipe(rename({suffix:'.min'}))
        .pipe(rev())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(rev.manifest('rev-css-manifest.json'))
        .pipe(gulp.dest('./dist/rev'));

});

gulp.task('sass:watch',function () {
    return gulp.watch('src/sass/*.scss',['sass:dev']);
});
//=============================================================
gulp.task('script:dev',function () {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/js/'))
        .pipe(connect.reload());
});

gulp.task('script:build',function () {
    return gulp.src('src/js/**/*.js')
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(rename({suffix:'.min'}))
        .pipe(rev())
        .pipe(gulp.dest('dist/js/'))
        .pipe(rev.manifest('rev-js-manifest.json'))
        .pipe(gulp.dest('dist/rev'));
});

gulp.task('script:watch',function () {
    return gulp.watch('src/js/**/*.js',['script:dev']);
});
//=============================================================
gulp.task('html:dev',function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist')).pipe(connect.reload());
});
gulp.task('html:build',function () {
    return gulp.src(['dist/rev/*.json','src/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('dist'));
});

gulp.task('html:watch',function () {
    return gulp.watch('src/**/*.html',['html:dev']);
});

//=============================================================

gulp.task('dev',function(callback){
    runSequence('clean',['sass:dev','script:dev','html:dev','script:watch','sass:watch','html:watch'],'server',callback);
});

gulp.task('build',function(callback){
    runSequence('clean',['sass:build','script:build','html:build'],callback);
});
