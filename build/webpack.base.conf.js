var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require('webpack')

var CopyWebpackPlugin = require('copy-webpack-plugin')

var HtmlWebpackPlugin = require('html-webpack-plugin')
//非常酷的插件，自动浏览器预览最后生成的js boundles的内容
//var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
var _pageEntryBase='./src/module/*/index';
var pages = utils.getEntries(_pageEntryBase+'.html');
var entries = utils.getEntries(_pageEntryBase+'.js');

//用来屏蔽某些vue模板解析，方便开发迁移调试
var _excludes=[];
module.exports = {
  //入口文件
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.scss', '.css','.less'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      src : resolve('src'),
      style : resolve('src') + '/style',
      sass : resolve('src') + '/style/sass',
      libs : resolve('src') + '/libs',
      //page : __dirname + '/src/page',
      views : resolve('src') + '/module',
      config : resolve('static') + '/config',
      components : resolve('src') + '/components',
      services : resolve('src')  + '/services',
      images : resolve('src')  + '/images',
      paas: resolve('src')  + '/module/console/view/paas',
      'store2/cache': 'store2/src/store.cache.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        exclude: _excludes,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        exclude: _excludes,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test : /\.tpl$/,
        exclude: _excludes,
        loader : 'ejs-loader'
      },
      {
        test: /\.js$/,
        exclude: _excludes,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      // {
      //   test: /\.html$/,
      //   loader: 'vue-html'
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: _excludes,
        options: {
          limit: 10000,
          publicPath:process.env.NODE_ENV === 'production'?'../img/':utils.assetsPath('img/'),
          outputPath:utils.assetsPath('img/'),
          name: '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|svg|ttf|otf)(\?.*)?$/,
        exclude: _excludes,
        loader: 'url-loader',
        options: {
          limit: 10000,
          publicPath:process.env.NODE_ENV === 'production'?'../fonts/':utils.assetsPath('fonts/'),
          outputPath:utils.assetsPath('fonts/'),
          name: '[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    //非常酷的插件，自动浏览器预览最后生成的js boundles的内容
    /*new BundleAnalyzerPlugin({
     analyzerMode: 'static'
     }),*/
    //webpack在require动态路径时会加载整个目录的文件作为模块，这个插件可以限定要引入的模块
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/,
      /zh\-cn|en\-us/
    ),
    new webpack.ContextReplacementPlugin(
      /codemirror[\/\\]mode$/,
      /javascript/
    ),
    new webpack.ContextReplacementPlugin(
      /codemirror[\/\\]theme$/,
      /eclipse/
    ),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery",
      _: "lodash",
      'window.store': 'store2',
      'store': 'store2'
    }),


    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static/config'),
        to: 'config',
        ignore: ['.*']
      }
    ])


  ]
}
for(var page in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: page + '.html',
    template: pages[page], //模板路径
    inject: true,
    // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
    // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
    // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
    // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
    excludeChunks: Object.keys(pages).filter(item => {
      return (item != page)
    })
  }
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  module.exports.plugins.push(new HtmlWebpackPlugin(conf))
}
