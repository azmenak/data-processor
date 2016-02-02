import gulp from 'gulp';
import _ from 'lodash';
import fs from 'fs-extra-promise';
import path from 'path';
import mochaTester from 'mocha-gulp-watcher';
import inspect from './src/test/inspect';

global.inspect = inspect;

// All files in ./tasks which export a default function will be added
// as a gulp task
_.forEach(fs.readdirSync(path.resolve(__dirname, 'tasks')), (file) => {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    const task = require(path.resolve(__dirname, 'tasks', file)).default;
    if (task) {
      const name = file.slice(0, -3);
      gulp.task(name, task);
      // Alias a kabab-case version
      gulp.task(_.kebabCase(name), [name]);
    }
  }
})

gulp.task('mocha-watch', () => {
  if (!process.env.NODE_ENV) {
    console.log('Setting NODE_ENV=test');
    process.env.NODE_ENV = 'test';
  }
  return gulp.watch(['**/*.js', '!node_modules/**/*'], mochaTester('log'));
});

gulp.task('mocha', () => {
  if (!process.env.NODE_ENV) {
    console.log('Setting NODE_ENV=test');
    process.env.NODE_ENV = 'test';
  }
  return mochaTester('process')();
});
