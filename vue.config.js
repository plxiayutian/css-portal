// vue.config.js
const webpack = require('webpack'); //引入webpack
const path = require('path');

function resolve(dir) {
	return path.join(__dirname, dir)
}

//包分析插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let config = {
	// baseUrl: './',    // Vue CLI 3.3 起已弃用
	publicPath: './', //部署应用包时的基本 URL
	// outputDir: 'dist', //当运行 vue-cli-service build 时生成的生产环境构建文件的目录。
	// assetsDir: 'assets', //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
	// indexPath: 'index.html', //指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
	// filenameHashing: true, //生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
	// pages: htmls,
	pages: {
		index: {
			// page 的入口
			entry: './src/pages/index/index.js',
			// 模板来源
			// template: 'public/index.html',
			template: './src/pages/index/index.html',
			// 在 dist/index.html 的输出
			filename: 'index.html', //需要.html才能进入默认首页
			// 当使用 title 选项时，
			// template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
			title: 'portal',
			// 在这个页面中包含的块，默认情况下会包含
			// 提取出来的通用 chunk 和 vendor chunk。
			chunks: ['chunk-vendors', 'chunk-common', 'index']
			// chunks: ['vendors', 'vue', 'vuex', 'vue-router', 'element-ui', 'index']
		},
		manage: {
			entry: './src/pages/manage/index.js',
			// template: 'public/index.html',
			template: './src/pages/manage/index.html',
			filename: 'manage', //不能用index.html否则跳转不过来
			// 当使用 title 选项时，
			// template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
			title: 'portal',
			// 在这个页面中包含的块，默认情况下会包含
			// 提取出来的通用 chunk 和 vendor chunk。
			chunks: ['chunk-vendors', 'chunk-common', 'manage']
			// chunks: ['vendors', 'vue', 'vuex', 'vue-router', 'element-ui', 'manage']
		},
		// 只有entry属性时，直接用字符串表示模块入口
		// index: './src/pages/index/index.js',
		// manage: './src/pages/manage/manage.js'
	},
	// eslint-loader 是否在保存的时候检查
	lintOnSave: false,
	// // 是否使用包含运行时编译器的Vue核心的构建
	// runtimeCompiler: false,
	// 浏览器兼容处理，默认情况下 babel-loader 忽略其中的所有文件 node_modules
	transpileDependencies: ['js-base64', 'engine.io-client'],
	// // 生产环境 sourceMap
	// productionSourceMap: false,
	devServer: {
		// open: true,
		// host: '127.0.0.1',
		// port: 3000,
		// https: false,
		// hotOnly: false,
		proxy: {
			//登录接口服务
			'/login': {
				target: 'http://localhost:8082',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/login': ''
				}
			},
			//门户接口服务
			'/api': {
				target: 'http://localhost:8082',
				ws: true,
				changeOrigin: true
			},
			//平台接口服务
			'/portal': {
				target: 'http://localhost:8082',
				ws: true,
				changeOrigin: true
			},
			//平台资源接口服务
			'/platform': {
				target: 'http://localhost:8082',
				ws: true,
				changeOrigin: true
			}
		},
		overlay: {
			warnings: true,
			errors: true
		}
	},
	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'sass',
			patterns: [
				path.resolve(__dirname, './src/assets/variables/*.scss') //.scss文件所在目录
			]
		},
		'style-resources-loader': {
			preProcessor: 'less',
			patterns: [
				path.resolve(__dirname, './src/assets/variables/*.less') // less所在文件路径
			]
		}
	},
	css: {
		// //将组件内的css提取到一个单独的css文件（只用在生产环境中）
		// //生产使用：`extract-text-webpack-plugin`插件
		// extract: process.env.NODE_ENV === "production" ? true : false,
		// //是否开启CSS source map
		// sourceMap: false,
		// //为所有的CSS及其预处理文件开启CSS Modules，是否去掉文件名中的.module
		// //不影响 `*.vue`文件。
		// requireModuleExtension: false,
		//为预处理器的loader传递自定义选项
		//支持 css-loader、postcss-loader、sass-loader、less-loader、stylus-loader
		loaderOptions: {
			sass: {
				//引入sass样式
				// prependData: `
				// 	@import "~@src/assets/variables/index.scss"; 
				// `,
				sassOptions: {
					javascriptEnabled: true
				}
			},
			// scss: {
			// 	//引入sass样式
			// 	prependData: `@import "./src/assets/variables/index.scss"; `
			// },
			less: {
				lessOptions: {
					javascriptEnabled: true
				}
			}
		}
	},
	configureWebpack: {
		// 不编译文件过滤
		// externals: {
		// 	"vue": 'Vue',
		// 	"echarts": 'echarts',
		// 	"element-ui": 'ELEMENT',
		// },
		plugins: [
			// webpack-bundle-analyzer分析插件
			// new BundleAnalyzerPlugin(),
			// 全局使用jquery
			new webpack.ProvidePlugin({
				//配置jquery
				$: 'jquery',
				jquery: 'jquery',
				jQuery: 'jquery',
				'window.jQuery': 'jquery'
			})
		],
	},
	chainWebpack: config => {
		//sass-resources-loader插件引入sass文件
		const oneOfsMap = config.module.rule('scss').oneOfs.store
		oneOfsMap.forEach(item => {
			item
				.use('sass-resources-loader')
				.loader('sass-resources-loader')
				.options({
					// 要公用的scss的路径
					// resources: './src/assets/variables/*.scss',
					// 引入多个scss文件
					resources: [
						'./src/assets/variables/index.scss',
						'./src/assets/variables/indexEdit.scss',
					]
				})
				.end()
		})
	}
}
// //开发环境--配置vconsole优化
// const vConsolePlugin = require('vconsole-webpack-plugin');
// if (process.env.NODE_ENV !== 'production') {
// 	//移动端模拟开发者工具
// 	config.configureWebpack.plugins.push(new vConsolePlugin({
// 		filter: [], // 需要过滤的入口文件
// 		enable: true
// 	}));
// }
module.exports = config; //导出
