const { series, src, dest, watch} = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create();

const cssnano = require('cssnano')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')

const plugins = [cssnano({ preset: 'default' })]


const mqpacker = require('css-mqpacker')
const sortCSSmq = require('sort-css-media-queries')

const autoprefixer = require('autoprefixer')

// autoprefix
const PLUGINS = [
  autoprefixer({
    overrideBrowserslist: ['last 5 versions'],
    cascade: true
  }),
  mqpacker({ sort: sortCSSmq })
]

// scss
function scss() {
  return src('./assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(PLUGINS))
    .pipe(dest('./assets/css'))
    .pipe(browserSync.stream())
}
// optimisation CSS + autoprefix
function scssMin () {
  const pluginsExtended = PLUGINS.concat([cssnano({
      preset: 'default'
  })]);
  return src('./assets/scss/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss(plugins))
  .pipe(rename({ suffix: '.min' }))
  .pipe(dest('./assets/css'))
}
// browser-sync
function syncInit () {
  browserSync.init({
      server: {
          baseDir: './'
      }
  });
}
async function sync() {
  browserSync.reload()
}

function watchFiles() {
  syncInit()
  watch('./assets/scss/**/*.scss', scss)
  watch('./*.html', sync)
  watch('./*.js', sync)
}

exports.default=series(scss, scssMin, watchFiles)