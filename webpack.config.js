const path = require('path');
const webpack = require('webpack');
const dir = path.join.bind(path, __dirname);
const es3ifyPlugin = require('es3ify-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin=require("copy-webpack-plugin");
module.exports = {
    entry: {
        index: './src/index.js',
        // jquery:'./src/jquery.min.js',
        // antd:'./src/antd.min.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
        // publicPath: './',
        chunkFilename: 'js/[name].js',
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            'react':        'anujs/dist/ReactIE.js',
            'react-dom':  'anujs/dist/ReactIE.js',
            'prop-types':  'anujs/lib/ReactPropTypes.js',
            'create-react-class': 'anujs/lib/createClass.js',
            'router':'anujs/dist/Router.js',
            "@": dir("src"),
            '@components': dir("src/components"),
            '@page': dir("src/page"),
        }
    },
    devtool: 'source-map',//不使用eval方便调试
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015-loose', 'react'],
                        plugins: [
                            'transform-class-properties',
                            [
                                'transform-es2015-classes',
                                {
                                    loose: true
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.(css|less)$/,
                use: ['style-loader', 'css-loader','less-loader']
            },
            // {
            //     test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            //     use: [
            //         {
            //             loader: 'url-loader',
            //             options: {
            //                 limit: 5120,
            //                 outputPath:"img/"
            //             }
            //         }
            //     ]
            // },
            { 
              test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, 
              loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            },
            {
              test: /\.(woff|woff2|eot|ttf|otf)$/,
              loader: 'file-loader',
              query: {
                name: 'file/[hash:8].[ext]',
              },
            },
        ]
    },
    mode: 'development',
    plugins: [
      new es3ifyPlugin(),
      //对项目静态资源打包
      new copyWebpackPlugin([{
        from:__dirname+'/public/img',
        to:'./img'
      }]),
      // 生成html
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'public/index.html',
        inject: 'body',
        hase: false,
        minify: {
            // 压缩HTML文件
            removeComments: true, // 移除HTML中的注释
            collapseWhitespace: false, // 删除空白符与换行符
        },
        chunks: ['index'],
    }),
    ],
    // 分离jquery
    // optimization: {
    //   splitChunks: {
    //       cacheGroups: {
    //           commons: {
    //               name: "jquery",
    //               chunks: "all",
    //               minChunks: 1
    //           }
    //       }
    //   }
    // },
    // 起服务
    devServer: {
      historyApiFallback: true,
      hot: true,
      host: 'localhost',
      port: 8000,
      inline: true,
      stats: { colors: true },
      contentBase: 'dist',
    },
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 30,
      poll: 10000 // 每秒检查一次变动
    }
};