/**
 * beamt die Dateien aus dem public-Ordner nach erfassen.ch/public
 */

'use strict'

const gulp = require('gulp')
const sftp = require('gulp-sftp')
const sftpPass = require('../sftpPass.json')

gulp.task('sftp', () => {
  return gulp.src('public/**')
    .pipe(sftp({
      host: '46.101.159.23',
      port: 30000,
      remotePath: 'bb',
      user: sftpPass.user,
      pass: sftpPass.pass
    }))
})
