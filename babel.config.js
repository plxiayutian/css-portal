module.exports = {
	presets: [
		[
			'@vue/app',
			{
				"useBuiltIns": "entry",
				//配置babel-polyfill,允许使用promise和symbol
				polyfills: [
					'es.promise',
					'es.symbol'
				]
			},
			//使用插件把es6编译成es5
			'@vue/cli-plugin-babel/preset'
		]
	],
	"plugins": [
		"@babel/plugin-syntax-dynamic-import",
		[
			"component",
			{
				"libraryName": "element-ui",
				"styleLibraryName": "theme-chalk"
			}
		]
	]
}
