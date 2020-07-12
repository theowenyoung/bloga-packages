const clone = require('git-clone')
const tmp = require('tmp')
const path = require('path')
const fs = require('fs-extra')

exports.loadBlogaWorkflows = async function ({
  template,
  path: distPath,
}) {
  return new Promise((resolve, reject) => {
    tmp.dir({unsafeCleanup: true}, (err, dirPath, cleanupCallback) => {
      if (err) reject(err)
      clone(template, dirPath, {
        clone: true,
        shallow: true,
      }, err => {
        if (err) reject(err)
        const finalDistPath = distPath ? distPath : path.resolve(process.cwd(), '.github/workflows')
        fs.copy(path.resolve(dirPath, '.github/workflows'), finalDistPath, {
          overwrite: true,
          filter: item => {
            const basename = path.basename(item)
            if (isDir(item) && basename === 'workflows') {
              return true
            }
            const ext = path.extname(item)
            if (basename.indexOf('bloga-') === 0 && ext === '.yml') {
              return true
            }
            return false
          },
        }, err => {
          if (err) reject(err)
          cleanupCallback()
          return resolve()
        })
      })
    })
  })
}

function isDir(path) {
  try {
    var stat = fs.lstatSync(path)
    return stat.isDirectory()
  } catch (error) {
    // lstatSync throws an error if path doesn't exist
    return false
  }
}
