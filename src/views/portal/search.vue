<template>
	<div id="app">
		<el-container class="page-content">
			<el-main class="page-main">
				<!-- 页头 -->
				<header v-if="pageData.header">
					<Header></Header>
				</header>
				<!-- 全文检索 -->
				<div class="search-box">
					<Search></Search>
				</div>
				<!-- 页脚 -->
				<footer v-if="pageData.footer">
					<Footer></Footer>
				</footer>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	export default {
		name: 'searchApp',
		data() {
			return {
				//当前页面数据
				pageData: {
					//字号大小
					fontSize: "",
					//主题颜色
					styleName: "",
					//展示页头
					header: true,
					//展示页脚
					footer: true,
					//模块数据
					arrModule: []
				},
				//主题颜色
				arrTheme: [], //["#409EFF", "#FF0000"]
			}
		},
		// 计算属性
		computed: {
			//页面id
			pageId() {
				return this.$store.state.pageId
			},
			//主题颜色
			themeColor() {
				return this.pageData.styleName
			},
			//字号
			fontSize() {
				return this.pageData.fontSize
			}
		},
		watch: {
			//主题颜色
			themeColor(color) {
				let tTheme = "theme"
				this.arrTheme.map((item, index) => {
					if (color.toString().toLowerCase() == item.dictItemCode) {
						tTheme = "theme" + (index || "")
					}
				})
				//设置自定义属性
				document.documentElement.setAttribute('data-theme', tTheme)
				//修改变量--color-primary的值
				document.documentElement.style.setProperty("--color-primary", "#" + color) //name为css变量名 e.g: --color-primary
			},
			//字号
			fontSize(value) {
				//设置自定义属性
				document.documentElement.setAttribute('data-size', value)
			}
		},
		components: {
			//组件懒加载
			Header: resolve => {
				require(['../../components/resource/SearchHeader.vue'], resolve)
			},
			Footer: resolve => {
				require(['../../components/resource/Footer.vue'], resolve)
			},
			Search: resolve => {
				require(['../../components/resource/Search.vue'], resolve)
			},
		},
		methods: {

		},
		mounted: function() {

		}
	}
</script>

<style lang="scss">
	#app {
		overflow: auto;
		@include addFontSize($font-size-main);
	}

	.router_tool {
		position: absolute;
		top: 20px;
		left: 20px;
	}

	.el-container {
		height: 100%;
	}

	/* 需要使用scss的插值方式(#{$toolbarHeight})才能生效 */
	.page-content {
		height: 100%;
	}

	.page-main {
		padding: 0;
		min-width: 1200px;
		background-color: $bg-color;
	}

	.search-box {
		min-height: 656px;
	}
</style>
