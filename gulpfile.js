import gulp from 'gulp'
import babel from 'gulp-babel'
import del from 'del'
import jsxCoverage from 'gulp-jsx-coverage'

gulp.task('test', jsxCoverage.createTask({
  src: ['./test/**/*.js'],
  istanbul: {
    preserveComments: true,
    coverageVariable: '__MY_TEST_COVERAGE__',
    exclude: /node_modules|test[0-9]/
  },
  threshold: 50,
  transpile: {
    babel: {
      include: /\.jsx?$/,
      exclude: /node_modules/,
      omitExt: false
    }
  },
  coverage: {
    reporters: ['text-summary', 'json', 'lcov'],
    directory: 'coverage'
  },
  mocha: {
    reporter: 'spec'
  }
}))

gulp.task('build', () => gulp.src('./src/**/*.{js,jsx}')
    .pipe(babel())
    .pipe(gulp.dest('./dist')))

gulp.task('clear', () => del(['dist/*'])) // ready to remove

gulp.doneCallback = (err) => {
  process.exit(err ? 1 : 0)
}
