const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')
const colorThemes = require('./config/color-themes')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const assetsCDN = {
  // main.js里引入了对应的less以使 webpack-theme-color-replacer工作
  // https://cdn.jsdelivr.net/npm/ant-design-vue@1.3.9/dist/antd.min.css
  css: [],
  // 此处引入本地的js，以防系统在内部局域网搭建无法通过cdn下载
  js: [
    '/vue.min.js',
    '/axios.min.js',
    '/vue-router.min.js',
    '/vuex.min.js',
    '/moment.min.js',
    '/zh-cn.js',
    '/g2.min.js',
    '/data-set.min.js',
    '/antd-with-locales.js'
  ]
  // js: [
  //   'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
  //   'https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js',
  //   'https://cdn.jsdelivr.net/npm/vue-router@3.1.2/dist/vue-router.min.js',
  //   'https://cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
  //   'https://cdn.jsdelivr.net/npm/moment@2.24.0/moment.min.js',
  //   'https://cdn.jsdelivr.net/npm/moment@2.24.0/locale/zh-cn.js',
  //   'https://cdn.jsdelivr.net/npm/@antv/g2@3.5.7/dist/g2.min.js',
  //   'https://cdn.jsdelivr.net/npm/@antv/data-set@0.10.2/dist/data-set.min.js',
  //   'https://cdn.jsdelivr.net/npm/ant-design-vue@1.5.0-rc.4/dist/antd-with-locales.js'
  // ]
}
// webpack build externals
const prodExternals = {
  // key表示包名(import foo from 'xx' 里的xx)
  // value表示window下的全局变量名(库暴露出来的namespace,可查lib对应的webpack配置里的library字段)
  'vue': 'Vue',
  'axios': 'axios',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
  'moment': 'moment',
  '@antv/g2': 'G2',
  '@antv/data-set': 'DataSet',
  'ant-design-vue': 'antd'
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    externals: prodExternals,
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.IgnorePlugin(/moment\//)
    ]
  },

  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    // assets require on cdn
    config.plugin('html').tap(args => {
      args[0].cdn = assetsCDN
      return args
    })
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          ...colorThemes
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        pathRewrite: { '^/api': '' },
        ws: false,
        changeOrigin: true
      },
      '/openfile': {
        target: 'http://127.0.0.1:8080/openfile',
        pathRewrite: { '^/openfile': '' },
        ws: false,
        changeOrigin: true
      },
      '/tunnel': {
        target: 'http://127.0.0.1:8080/tunnel',
        pathRewrite: { '^/tunnel': '' },
        ws: false,
        changeOrigin: true
      },
      '/websocket': {
        target: 'ws://127.0.0.1:8080',
        pathRewrite: { '^/websocket': '' },
        ws: true,
        changeOrigin: true
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// 如果你不想在生产环境开启换肤功能，请打开下面注释
// if (process.env.VUE_APP_PREVIEW === 'true') {
// add `ThemeColorReplacer` plugin to webpack plugins
vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
// }

module.exports = vueConfig
