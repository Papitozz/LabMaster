// Импорт пакетов
const gulp = require('gulp')
const del = require('del')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const browsersync = require('browser-sync').create()
const htmlmin = require('gulp-htmlmin')

// Пути исходных файлов src и пути к результирующим файлам dest
const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },

  styles: {
    src: 'src/styles/*.scss',
    dest: 'dist/css/'
  },

  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  },

  images: {
    src: 'src/img/**',
    dest: 'dist/img/'
  }
}

// Очистить каталог dist, удалить все кроме изображений
function clean() {
  return del(['dist/*', '!dist/img'])
}

// Обработка html
function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browsersync.stream())
}

// Обработка препроцессоров стилей
function styles() {
  return gulp.src([paths.styles.src, "!src/styles/nullstyle.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    
    
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream())
}

// Задача для обработки скриптов
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init()) 
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream())
}

// Сжатие изображений
function img() {
  return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
		.pipe(imagemin({
      progressive: true
    }))
		.pipe(gulp.dest(paths.images.dest))
}

// Отслеживание изменений в файлах и запуск лайв сервера
function watch() {
  browsersync.init({
    server: {
      baseDir: "./dist/"
    }
  })
  gulp.watch(paths.html.dest).on('change', browsersync.reload)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.src, img)
}

// Таски для ручного запуска с помощью gulp clean, gulp html и т.д.
exports.clean = clean
exports.styles = styles
exports.watch = watch
exports.scripts = scripts
exports.img = img
exports.html = html

// Таск, который выполняется по команде gulp
exports.default = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch)
