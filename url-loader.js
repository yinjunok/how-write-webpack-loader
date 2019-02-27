const path = require('path');
const mime = require('mime');
const Buffer = require('buffer').Buffer;
const utils = require('loader-utils');

const defaultOptions = {
  publicPath: 'images',
  name: '[hash:8].[ext]',
  limit: 8000,
}

function log(...rest) {
  console.log('**********************************');
  console.log(...rest);
  console.log('**********************************');
}

module.exports = function(file) {
  // 获取 loader options
  const options = {
    ...defaultOptions,
    ...utils.getOptions(this)
  };

  const fileSize = Buffer.byteLength(file, 'utf8');

  if (fileSize < options.limit) {
    const base64String = file.toString('base64');
    const type = mime.getType(path.basename(this.resourcePath));
    // data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E
    return `module.exports = ${JSON.stringify(`data:${type ? type: ''};base64,${base64String}`)}`
  }

  const fileName = utils.interpolateName(this, options.name, {
    context: this.rootContext,
    content: file,
  });

  const relativePath = path.join(options.publicPath, fileName);

  this.emitFile(relativePath, file);

  return `module.exports = ${JSON.stringify(relativePath)}`; // stringify 是为了把 / 之类的字符转义
}

module.exports.raw = true;
