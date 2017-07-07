const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const child_process = require('child_process');
const config = require('config');
const root = config.get('root');

function rmrf(filepath) {
  if (!fs.existsSync(filepath)) return;
  const state = fs.statSync(filepath);
  if (state.isFile()) {
    return fs.unlinkSync(filepath);
  } else if (state.isDirectory()) {
    const files = fs.readdirSync(filepath);
    files.forEach(file => {
      rmrf(path.join(filepath, file));
    });
    return;
  }
  throw new Error('unknow file type:', filepath);
}

/**
 * 构建客户端代码
 */
async function buildClientCode() {
  rmrf(path.join(config.get('root'), 'statics'));
  const webpackConfig = require(path.join(root, 'config/webpack.prod.js'));
  await new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, state) => {
      if (err) return reject(err);

      if (state.hasErrors() || state.hasWarnings()) {
        const info = state.toJson({
          chunks: false,
        });
        if (state.hasErrors()) {
          info.errors.forEach(e => {
            console.error('ERROR:', e); // 打印错误
          })
        }
        if (state.hasWarnings()) {
          info.warnings.forEach(warn => {
            console.warn('WARN:', warn); // 打印报警
          })
        }
        return reject(new Error('compile faild'));
      }

      // 将构建信息写入 buildMeta.json 文件中
      const result = state.toJson();
      fs.writeFileSync(
        path.join(root, 'buildMeta.json'),
        JSON.stringify(result.assetsByChunkName)
      );
      resolve();
    });
  });
}

/**
 * 构建服务端代码
 */
async function buildServerCode() {
  rmrf(path.join(root, 'dist'));
  await new Promise((resolve, reject) => {
    // 执行 tsc 命令编译服务端代码
    child_process.execFile(
      path.join(root, '/node_modules/.bin/tsc'),
      ['-p', 'src/server'], (err, stderr) => {
      if (err) {
        console.error(err, stderr);
        return reject(new Error('compile faild'));
      };
      resolve();
    });
  })
}

async function build() {
  await Promise.all([buildClientCode(), buildServerCode()]);
}

build().then(() => {
  console.log('build done!');
  process.exit(0);
}, err => {
  console.error(err);
  process.exit(1);
})
