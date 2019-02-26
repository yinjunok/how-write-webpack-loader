const path = require('path');

module.exports = function(content) {
  // for (const p in this) {
  //   if (this.hasOwnProperty(p)) {
  //     console.log(p)
  //   }
  // }

  console.log('************************')
  console.log(this.resourcePath);
  console.log('************************')

  if (path.extname(this.resourcePath) === '.png') {
    this.emitFile('abc.png', content)
    return 'this.resourcePath';
  }
  return content;
}

module.exports.raw = true;