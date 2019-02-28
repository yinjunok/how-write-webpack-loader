# webpack loader, plugin 编写

## loader

webpack 中 loader 的作用是用于处理文件内容, 转换成能识别的 module, 一个 loader 的基本结构如下: 
```js
import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    }
  }
};

// webpack 会把文件内容传入 loader
export default function(source) {
  const options = getOptions(this);

  // 验证 loader 的配置是否正确
  validateOptions(schema, options, 'Example Loader');

  // 对资源应用一些转换……

  return `export default ${ JSON.stringify(source) }`;
}
```

下面演示一个最简单的 loader, 这个 loader 是为了转换 markdown.

```js
const marked = require('marked'); // 解析 markdown 的库.

module.exports = function(md) {
  const result = marked(md); // 解析 markdown

  return `module.exports = ${JSON.stringify(result)}`; // stringify 是为了把 / 之类的字符转义
}

```

复杂的例子, 如果文件大于设置的 limit 就把路径输出, 小于 limit 就转成 base64. 
做的事情跟 url-loader 类似. 需要注意的是, webpack 默认会把文件内容经过 utf8 解码后传给 loader.
下面的 loader 需要处理的是源文件, 所以要通过 `module.exports.raw = true;` 指明不需要经过 utf8 解码.

```js
module.exports = function(file) {
  // 获取 loader options
  let options = utils.getOptions(this) || {}
  validateOptions(schema, options, 'url-loader');

  options = {
    ...defaultOptions,
    ...options
  };

  // 计算文件尺寸
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

  // 将文件弹出
  this.emitFile(relativePath, file);

  return `module.exports = ${JSON.stringify(relativePath)}`; // stringify 是为了把 / 之类的字符转义
}

module.exports.raw = true;
```

[详细源码](./loader/url-loader.js)

## 编写插件

插件能扩展 webpack 功能, webpack 在构建过程中提供了大量的 hook 给我们编写插件.

```js
class HtmlPlugin {
  apply(compiler) {
    // 在文件输出到文件之前
    compiler.hooks.emit.tapAsync('HtmlPlugin', (compilation, callback) => {
      const css = [];
      const js = [];

      // 从输出文件中获取 js, css.
      for (var filename in compilation.assets) {
        const ext = path.extname(filename);

        if (ext === '.css') {
          css.push(`<link rel="stylesheet" type="text/css" href="${filename}">`);
        }

        if (ext === '.js') {
          js.push(`<script src="${filename}"></script>`);
        }
      }

      // HTML 模板, 将 css, js 写入其中.
      const template = `
        <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
            ${css.join('\n\n')}
          </head>
          <body>
            <div id="app"></div>
            ${js.join('\n\n')}
          </body>
        </html>
      `;

      // 将这个 HTML 作为一个新的文件资源，插入到 webpack 构建中：
      compilation.assets['index.html'] = {
        source() {
          return template;
        },
        size() {
          return template.length;
        }
      };

      callback();
    });
  }
}
```

文档:  
https://webpack.docschina.org/api/loaders/  
https://webpack.docschina.org/contribute/writing-a-loader/  
https://webpack.docschina.org/contribute/writing-a-plugin/  