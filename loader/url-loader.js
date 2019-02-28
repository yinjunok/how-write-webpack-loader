const path = require('path');
const mime = require('mime');
const Buffer = require('buffer').Buffer;
const utils = require('loader-utils');
const validateOptions = require('schema-utils');

const defaultOptions = {
  publicPath: 'images',
  name: '[hash:8].[ext]',
  limit: 8000,
};

// 配置校验规则
const schema = {
  "type": "object",
  "properties": {
    "publicPath": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "limit": {
      "type": "number"
    },
    "errorMessage": {
      "publicPath": "url-loader publicPath option should be a string", 
      "name": "url-loader name option should be a string", 
      "limit": "url-loader limit option should be a number"
    }
  },
  "additionalProperties": false
};

module.exports = function(file) {
  // 获取 loader options
  let options = utils.getOptions(this) || {}
  validateOptions(schema, options, 'url-loader');

  options = {
    ...defaultOptions,
    ...options
  };

  const fileSize = Buffer.byteLength(file, 'utf8');

  // 如果文件大小符合条件, 就返回 base64
  if (fileSize < options.limit) {
    const base64String = file.toString('base64');
    const type = mime.getType(path.basename(this.resourcePath));
    return `module.exports = ${JSON.stringify(`data:${type ? type: ''};base64,${base64String}`)}`
  }

  // 否则返回路径
  const fileName = utils.interpolateName(this, options.name, {
    context: this.rootContext,
    content: file,
  });

  const relativePath = path.join(options.publicPath, fileName);

  this.emitFile(relativePath, file);

  return `module.exports = ${JSON.stringify(relativePath)}`; // stringify 是为了把 / 之类的字符转义
}

module.exports.raw = true;
