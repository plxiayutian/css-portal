<template>
	<div id="app">
		<el-container class="page-content">
			<el-main class="page-main">
				<!-- 页头 -->
				<header v-if="pageData.header">
					<Header></Header>
				</header>
				<div id="pageArea" ref="pageArea" :class="['page-area', { crosshair: isAddModule }]" :style="{ minHeight: '939px' }">
					<template>
						<!-- 展示的模块或模块及资源--无工具栏--不可拖拽 -->
						<div v-for="(item,index) in showModuleArr" :key="'showModule_'+index">
							<div :id="item.id" class="module_style" :style="{ top: item.curTop,left: item.curLeft,width: item.curWidth,height: item.curHeight }">
								<template v-if="item.draggableElement">
									<component :is="item.draggableElement.draggableElementType" :moduleId="item.draggableElement.draggableModuleId"
									 :moduleData="item.resourceVO"></component>
								</template>
							</div>
						</div>
					</template>
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
	// 引入自定义组件
	// import Header from '../../components/resource/Header.vue'
	// import Footer from '../../components/resource/Footer.vue'
	// import carousel from '../../components/resource/Carousel'
	// import list from '../../components/resource/List'

	// 引入js组件
	import selectArea from '../../plugins/selectArea.js'
	export default {
		name: 'IndexApp',
		data() {
			return {
				//选择区域
				selectArea: selectArea,
				// 栅格
				grid: {
					cols: 24, //列数,最大24列
					rows: 18, //行数，默认11行
					colWidth: '4.16667%', // 每行宽度
					rowHeight: "50px" // 每行高度
				},
				//当前页面数据
				pageData: {
					//字号大小
					fontSize: "",
					//主题颜色
					styleName: "",
					//展示页头
					header: false,
					//展示页脚
					footer: false,
					//模块数据
					arrModule: []
				},
				//主题颜色
				arrTheme: [], //["#409EFF", "#FF0000"]
				//是否正在添加模块
				isAddModule: false,
				//当前正在修改模块名称的模块
				moduleItemIndex: "",
				//展示的模块或模块及资源--无工具栏--有或无资源
				showModuleArr: [],
				//数据字典资源类型
				resourceType: {},
				//默认展开的资源类型面板
				activeCollapse: [],
				//资源列表数据
				objResource: {},
				//右侧资源折叠面板初始高度
				resourceH: 0
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
				require(['../../components/resource/Header.vue'], resolve)
			},
			Footer: resolve => {
				require(['../../components/resource/Footer.vue'], resolve)
			},
			carousel: resolve => {
				require(['../../components/resource/Carousel.vue'], resolve)
			},
			list: resolve => {
				require(['../../components/resource/List.vue'], resolve)
			}
			// Header, //页头
			// Footer, //页脚
			// carousel, //轮播图
			// list //文章列表
		},
		methods: {
			// 初始化模块
			initModule(data) {
				this.selectArea.calculateGrid(this.grid.colWidth, this.grid.rowHeight)
				this.showModuleArr.push(this.selectArea.init(data))
			},
			// 获取数据字典主题颜色数据项
			fetchThemeColor() {
				this.axios.get('/portal/api/commons/dictitembydictcode/style_name')
					.then((res) => {
						if (res.data && res.data.length > 0) {
							this.arrTheme = res.data
						}
					})
					.catch((error) => {
						console.log(error)
					})
			},
			// 获取当前激活的页面ID
			fetchUsePageId() {
				this.axios.get('/portal/api/pages/enablepage')
					.then((res) => {
						if (res.data) {
							//获取页面数据
							this.fetchPageData(res.data.id)
							//获取模块数据
							this.fetchModuleData(res.data.id)
						}
					})
					.catch((error) => {
						console.log(error)
					})
			},
			// 根据pageId获取页面模块数据
			fetchModuleData(pageId) {
				this.axios.get('/portal/api/modules/' + pageId + '/module/resource')
					.then((res) => {
						if (res.data) {
							if (res.data.length > 0) {
								res.data.map((item, index) => {
									this.initModule(item) //初始化模块
								})
							}
						}
					})
			},
			//获取页面数据
			fetchPageData(pageId) {
				if (pageId) {
					this.axios.get('/portal/api/pages/' + pageId)
						.then((res) => {
							if (res.data) {
								//页头显示
								res.data.header = res.data.header == "1" ? true : false
								//页脚显示
								res.data.footer = res.data.footer == "1" ? true : false
								//页面数据赋初值
								Object.assign(this.pageData, res.data)
							}
						})
				} else {
					// 获取所有页面数据
					this.axios.get('/portal/api/pages/user/index')
						.then((res) => {
							if (res.data) {
								if (res.data.pageInfo) {
									let pageInfo = res.data.pageInfo;
									//页头显示
									pageInfo.header = pageInfo.header == "1" ? true : false
									//页脚显示
									pageInfo.footer = pageInfo.footer == "1" ? true : false
									//页面数据赋初值
									Object.assign(this.pageData, pageInfo)
									//释放内存
									pageInfo = null
								}
								if (res.data.moduleList && res.data.moduleList.length > 0) {
									let arrModule = res.data.moduleList;
									arrModule.map((item, index) => {
										this.initModule(item) //初始化模块
									})
									//释放内存
									arrModule = null
								}
							}
						})
				}
			}
		},
		mounted: function() {
			//获取数据字典主题颜色数据项
			this.fetchThemeColor()
			// 判断是否为预览页面
			if (this.$route.query.preview && this.$store.state.pageId) {
				let currentPageId = this.$store.state.pageId
				//获取页面数据
				this.fetchPageData(currentPageId)
				//获取模块数据
				this.fetchModuleData(currentPageId)
			} else {
				//获取页面Id
				// this.fetchUsePageId()
				//获取页面数据
				this.fetchPageData()
			}
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

	/* 模板样式 */
	.module_style {
		position: absolute;
		border: 0;
		background: $bg-color;
		cursor: default;
	}
</style>
