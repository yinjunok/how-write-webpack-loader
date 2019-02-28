const path = require('path');

class HtmlPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {

      const css = [];
      const js = [];

      for (var filename in compilation.assets) {
        const ext = path.extname(filename);

        if (ext === '.css') {
          css.push(`<link rel="stylesheet" type="text/css" href="${filename}">`);
        }

        if (ext === '.js') {
          js.push(`<script src="${filename}"></script>`);
        }
      }

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

      // 将这个列表作为一个新的文件资源，插入到 webpack 构建中：
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

module.exports = HtmlPlugin;