'use strict';

let path = require('path')
let fs = require('fs')

let webpack = require('webpack')
let glob = require('glob')

let ExtractTextPlugin = require('extract-text-webpack-plugin')
let HtmlWebpackPlugin = require('html-webpack-plugin')

let UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
let CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

let srcDir = path.resolve(process.cwd(), 'src')
let assets = path.resolve(process.cwd(), 'assets')
let nodeModPath = path.resolve(__dirname, './node_modules')
let pathMap = Object.assign({
    'jquery': path.join(nodeModPath, '/jquery/dist/jquery.js'),
    'zepto': path.join(nodeModPath, '/zepto/zepto.min.js'),
    'JS': srcDir + '/js',
    'IMG': srcDir + '/img',
    'LESS': srcDir + '/less',
    'echarts$': srcDir + "/js/vendor/echarts/src/echarts.js",
    'echarts': srcDir + "/js/vendor/echarts/src",
    'zrender$': srcDir + "/js/vendor/zrender/src/zrender.js",
    'zrender': srcDir + "/js/vendor/zrender/src"
}, require('./src/pathmap.json'))

//入口文件
let entries = (() => {
    let entryDir = path.resolve(srcDir, 'js/pages')
    let entryFiles = glob.sync(entryDir + '/*.{js,jsx}')
    let map = {}

    entryFiles.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        map[filename] = filePath
    })

    return map
}())
let chunks = Object.keys(entries)

module.exports = (options) => {
    options = options || {}

    let debug = options.debug !== undefined ? options.debug : true
        // 这里publicPath要使用绝对路径，不然scss/css最终生成的css图片引用路径是错误的，应该是scss-loader的bug
    let publicPath = debug ? '/' : 'http://static.a.carry6.com/'
    let extractCSS
    let cssLoader
    let lessLoader

    // generate entry html files
    // 自动生成入口文件，入口js名必须和入口文件名相同
    // 例如，a页的入口文件是a.html，那么在js目录下必须有一个a.js作为入口文件
    let plugins = () => {
        let entryHtml = glob.sync(srcDir + '/*.html')
        let r = []

        entryHtml.forEach((filePath) => {
            let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
            let conf = {
                template: 'html!' + filePath,
                filename: filename + '.html',
                chunksSortMode: function(a, b) {
                    if (a.names[0] == 'commons') return -1;
                    if (b.names[0] == 'commons') return 1;
                    if (a.names[0] == 'vendor') return -1;
                    if (b.names[0] == 'vendor') return 1;
                    return 1
                }
            }

            if (filename in entries) {
                conf.inject = 'body'
                conf.chunks = ['vendor', 'commons', filename]
            }

            r.push(new HtmlWebpackPlugin(conf))
        })

        return r
    }()

    if (debug) {

        // components单元测试入口js
        let componentsUnitEntries = () => {
            let jsDir = path.resolve(srcDir, 'js/components')
            let components = glob.sync(jsDir + '/**/__test__/index.js')
            let map = {};


            components.forEach((filePath) => {
                // components单元测试入口文件
                let componentsHmtlConfig = {
                    template: 'html!./src/tmpl/component-unit.html',
                    inject: 'body',
                    chunks: ['vendor', 'commons'],
                    chunksSortMode: function(a, b) {
                        if (a.names[0] == 'commons') return -1;
                        if (b.names[0] == 'commons') return 1;
                        if (a.names[0] == 'vendor') return -1;
                        if (b.names[0] == 'vendor') return 1;
                        return 1
                    }
                };
                let componentName = filePath.substring(filePath.indexOf('\/components\/') + 12, filePath.indexOf('\/__test__\/index.js'));

                map['test.' + componentName] = filePath;
                componentsHmtlConfig.filename = '__test__/' + componentName + '.html';
                componentsHmtlConfig.chunks.push('test.' + componentName);
                plugins.push(new HtmlWebpackPlugin(componentsHmtlConfig))
            })

            return map
        }()
        entries = Object.assign(entries, componentsUnitEntries)
        extractCSS = new ExtractTextPlugin('css/[name].css?[contenthash]')
        cssLoader = extractCSS.extract(['css'])
        lessLoader = extractCSS.extract(['css', 'less'])
        plugins.push(extractCSS, new webpack.HotModuleReplacementPlugin())
    } else {
        extractCSS = new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {
            // 当allChunks指定为false时，css loader必须指定怎么处理
            // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
            // 第一个参数`notExtractLoader`，一般是使用style-loader
            // @see https://github.com/webpack/extract-text-webpack-plugin
            allChunks: false
        })
        cssLoader = extractCSS.extract(['css?minimize'])
        lessLoader = extractCSS.extract(['css?minimize', 'less'])

        plugins.push(
            extractCSS,
            new UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                },
                mangle: {
                    except: ['$', 'exports', 'require']
                }
            }),
            // new AssetsPlugin({
            //     filename: path.resolve(assets, 'source-map.json')
            // }),
            new webpack.optimize.DedupePlugin(),
            new webpack.NoErrorsPlugin()
        )

        plugins.push(new UglifyJsPlugin())
    }

    let config = {
        entry: Object.assign(entries, {
            // 用到什么公共lib（例如React.js），就把它加进vendor去，目的是将公用库单独提取打包
            'vendor': ['jquery']
        }),

        output: {
            path: assets,
            filename: debug ? '[name].js' : 'js/[chunkhash:8].[name].min.js',
            chunkFilename: debug ? '[chunkhash:8].chunk.js' : 'js/[chunkhash:8].chunk.min.js',
            hotUpdateChunkFilename: debug ? '[id].js' : 'js/[id].[chunkhash:8].min.js',
            publicPath: publicPath
        },

        resolve: {
            root: [srcDir, './node_modules'],
            alias: pathMap,
            extensions: ['', '.js', '.css', '.less', '.jade', '.png', '.jpg']
        },

        resolveLoader: {
            root: path.join(__dirname, 'node_modules')
        },

        module: {
            loaders: [{
                test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
                loaders: [
                    // url-loader更好用，小于10KB的图片会自动转成dataUrl，
                    // 否则则调用file-loader，参数直接传入
                    'url?limit=10000&name=img/[hash:8].[name].[ext]',
                    'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
                ]
            }, {
                test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
                loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
            }, {
                test: /\.(tpl|ejs)$/,
                loader: 'ejs'
            }, {
                test: /\.css$/,
                loader: cssLoader
            }, {
                test: /\.less$/,
                loader: lessLoader
            }, {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel?presets[]=react,presets[]=es2015'
            }]
        },

        plugins: [
            new CommonsChunkPlugin({
                name: 'commons',
                filename: 'js/commons.js',
                minChunk: 3
                    //chunks:[指定模块entries]
            })
        ].concat(plugins),

        devServer: {
            hot: true,
            noInfo: false,
            inline: true,
            publicPath: publicPath,
            stats: {
                cached: false,
                colors: true
            }
        }
    }

    if (debug) {
        // 为实现webpack-hot-middleware做相关配置
        // @see https://github.com/glenjamin/webpack-hot-middleware
        ((entry) => {
            for (let key of Object.keys(entry)) {
                if (!Array.isArray(entry[key])) {
                    entry[key] = Array.of(entry[key])
                }
                entry[key].push('webpack-hot-middleware/client?reload=true')
            }
        })(config.entry)

        config.plugins.push(new webpack.HotModuleReplacementPlugin())
        config.plugins.push(new webpack.NoErrorsPlugin())
    }

    return config
}