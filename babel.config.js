module.exports = {
	presets: [
		[
			'@vue/app',
			{
				"useBuiltIns": "entry",
				polyfills: [
					'es.promise',
					'es.symbol'
				]
			},
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
