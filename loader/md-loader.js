const marked = require('marked');

module.exports = function(md) {
  const result = marked(md);

  return `module.exports = ${JSON.stringify(result)}`; // stringify 是为了把 / 之类的字符转义
}

