var gulp = require('gulp');
var gls = require('gulp-live-server');
var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var del = require('del');
var ghpages = require('gh-pages');

var paths = {
  src: '**/*',
  srcData: 'data/*.*',
  srcHTML: '*.html',
  srcCNAME: 'CNAME',
  srcCSS: 'css/*.css',
  srcImages: 'images/*.*',
  srcNodeCSS: [
    'node_modules/bootswatch/dist/sandstone/bootstrap.min.css'
  ],
  srcJS: 'js/*.js',
  srcNodeJS: [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/popper.js/dist/umd/popper.min.js',
    'node_modules/papaparse/papaparse.js'
  ],
  tmp: 'tmp',
  tmpData: 'tmp/data/',
  tmpCSS: 'tmp/css/',
  tmpImages: 'tmp/images/',
  tmpJS: 'tmp/js',
  dist: 'dist',
  distData: 'dist/data/',
  distCSS: 'dist/css/',
  distImages: 'dist/images/',
  distJS: 'dist/js/'
};

gulp.task('data', function () {
  return gulp.src(paths.srcData)
    .pipe(gulp.dest(paths.tmpData));
});

gulp.task('data:dist', function () {
  return gulp.src(paths.srcData)
    .pipe(gulp.dest(paths.distData));
});

gulp.task('html', function () {
  return gulp.src(paths.srcHTML)
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('html:dist', function () {
  return gulp.src(paths.srcHTML)
    .pipe(htmlclean())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('cname:dist', function () {
  return gulp.src(paths.srcCNAME)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('cssnode', function () {
  return gulp.src(paths.srcNodeCSS)
    .pipe(gulp.dest(paths.tmpCSS));
});

gulp.task('cssnode:dist', function () {
  return gulp.src(paths.srcNodeCSS)
    .pipe(concat('packages.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.distCSS));
});

gulp.task('css', function () {
  return gulp.src(paths.srcCSS)
    .pipe(gulp.dest(paths.tmpCSS));
});

gulp.task('css:dist', function () {
  return gulp.src(paths.srcCSS)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.distCSS));
});

gulp.task('images', function () {
  return gulp.src(paths.srcImages)
    .pipe(gulp.dest(paths.tmpImages));
});

gulp.task('images:dist', function () {
  return gulp.src(paths.srcImages)
    .pipe(gulp.dest(paths.distImages));
});

gulp.task('jsnode', function () {
  return gulp.src(paths.srcNodeJS)
    .pipe(gulp.dest(paths.tmpJS));
});

gulp.task('jsnode:dist', function () {
  return gulp.src(paths.srcNodeJS)
    .pipe(concat('packages.min.js'))
    .pipe(gulp.dest(paths.distJS));
});

gulp.task('js', function () {
  return gulp.src(paths.srcJS)
    .pipe(gulp.dest(paths.tmpJS));
});

gulp.task('js:dist', function () {
  return gulp.src(paths.srcJS)
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.distJS));
});

gulp.task('copy', gulp.series('data', 'html', 'cssnode', 'css', 'images', 'jsnode', 'js'));

gulp.task('copy:dist', gulp.series('data:dist', 'cname:dist', 'html:dist', 'cssnode:dist', 'css:dist', 'images:dist', 'jsnode:dist', 'js:dist'));

gulp.task('inject', function () {
  var target = gulp.src('tmp/*.html');
  var sourcejs = gulp.src(['tmp/js/jquery.js', 'tmp/js/*.js'], { read: false });
  var sourcecss = gulp.src('tmp/css/*.css', { read: false });
  return target
    .pipe(inject(sourcecss, { relative: true }))
    .pipe(inject(sourcejs, { relative: true }))
    .pipe(gulp.dest('./tmp'));
});

gulp.task('inject:dist', function () {
  var target = gulp.src('dist/*.html');
  var sourcejs = gulp.src(['dist/js/*.js'], { read: false });
  var sourcecss = gulp.src('dist/css/*.css', { read: false });
  return target
    .pipe(inject(sourcecss, { relative: true }))
    .pipe(inject(sourcejs, { relative: true }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('serve', function () {
  var server = gls.static('tmp', 8080);
  server.start();
});

gulp.task('debug', gulp.series('copy', 'inject', 'serve'));

gulp.task('build', gulp.series('copy:dist', 'inject:dist'));

gulp.task('clean', function () {
  return del([paths.tmp, paths.dist]);
});

gulp.task('deploy', function () {
  return ghpages.publish('dist');
});
