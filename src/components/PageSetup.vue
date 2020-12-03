<template>
	<el-form ref="form" :model="styleForm" label-width="80px">
		<el-form-item label="字体大小">
			<el-radio-group v-model="pageData.fontSize" size="small" @change="changeFontSize">
				<el-radio-button v-for="(item,index) in styleForm.arrFontSize" :key="'fontSize'+index" :label="item.description">{{item.dictItemName}}</el-radio-button>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="主题">
			<template v-for="(item,index) in styleForm.arrTheme">
				<el-radio v-model="pageData.styleName" v-if="item.dictItemCode=='red' || item.dictItemCode=='ff0000'" class="theme-red"
				 :label="item.dictItemCode" @change="changeColor(item.dictItemCode)">{{item.dictItemName}}</el-radio>
				<el-radio v-model="pageData.styleName" v-else :label="item.dictItemCode" @change="changeColor(item.dictItemCode)">{{item.dictItemName}}</el-radio>
			</template>
		</el-form-item>
		<el-form-item class="page-hf" label="页头">
			<el-switch v-model="pageData.header" @change="changeHeaderShow"></el-switch>
		</el-form-item>
		<el-form-item class="page-hf" label="页脚">
			<el-switch v-model="pageData.footer" @change="changeFooterShow"></el-switch>
		</el-form-item>
		<el-form-item label="栅格行数">
			<el-input-number size="small" v-model="grid.rows" :min="16" :max="999" label="请输入栅格行数"></el-input-number>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		props: ['pageData', 'grid'],
		name: 'PageSetup',
		data() {
			return {
				// 样式表单数据
				styleForm: {
					arrFontSize: [], //[12，14，16]
					arrTheme: [] //["#409EFF", "#FF0000"]
				},
				//数据字典资源类型
				resourceType: {}
			}
		},
		computed: {
			//页面id
			pageId() {
				return this.$store.state.pageId
			},
			//主题颜色
			themeColor() {
				return this.$store.state.themeColor
			},
			//字号
			fontSize() {
				return this.$store.state.fontSize
			},
		},
		watch: {
			//主题颜色
			themeColor(color) {
				let tTheme = "theme"
				this.styleForm.arrTheme.map((item, index) => {
					if (color == item.dictItemCode) {
						tTheme = "theme" + (index || "")
					}
				})
				//设置自定义属性
				document.documentElement.setAttribute("data-theme", tTheme)
				//修改变量--color-primary的值
				document.documentElement.style.setProperty("--color-primary", "#" + color) //name为css变量名 e.g: --color-primary
			},
			//字号
			fontSize(value) {
				//设置自定义属性
				document.documentElement.setAttribute("data-size", value)
			},
		},
		methods: {
			//获取数据字典项
			fetchDict() {
				this.axios
					.get("/portal/api/commons/dictitembydictcode", {
						params: {
							dictCodes: "font_size,style_name,resource_type", //获取字号、主题颜色、资源类型字典项
						},
					})
					.then((res) => {
						if (res && res.data) {
							let arrFontSize = res.data.font_size
							let arrThemeColor = res.data.style_name
							let arrResourceType = res.data.resource_type
							//字号
							if (arrFontSize && arrFontSize.length > 0) {
								arrFontSize.map((item, index) => {
									this.styleForm.arrFontSize.push(item)
								})
							}
							//颜色
							if (arrThemeColor && arrThemeColor.length > 0) {
								arrThemeColor.map((item, index) => {
									this.styleForm.arrTheme.push(item)
								})
							}
							//资源类型
							if (arrResourceType && arrResourceType.length > 0) {
								arrResourceType.map((item, index) => {
									this.resourceType[item.dictItemCode] = item.dictItemName
									// this.activeCollapse.push(item.dictItemCode) //资源列表需要展开的面板类型
								})
							}
						}
					})
					.catch((error) => {
						console.log(error)
					})
			},
			//设置字号
			changeFontSize(value) {
				if (this.pageId) {
					this.styleForm.fontSize = value
					//保存字号修改
					this.axios({
							method: "patch",
							url: "/portal/api/pages/fontsize/" + this.pageId + "/" + value,
						})
						.then((res) => {
							if (!res || !res.data) {
								this.pageData.fontSize = ""
								this.$message({
									type: "error",
									message: "字号修改失败！",
								})
							} else {
								//修改全局字号值
								this.$store.commit("setFontSize", res.data.fontSize)
							}
						})
						.catch((error) => {
							this.pageData.fontSize = ""
						})
				} else {
					this.$message({
						type: "info",
						message: "请选择或新建页面后再操作！",
					})
					this.pageData.fontSize = ""
				}
			},
			//主题颜色切换
			changeColor(color) {
				if (this.pageId) {
					this.styleForm.theme = color
					//保存主题颜色切换
					this.axios({
							method: "patch",
							url: "/portal/api/pages/stylename/" + this.pageId + "/" + color,
						})
						.then((res) => {
							if (!res || !res.data) {
								this.pageData.styleName = ""
								this.$message({
									type: "error",
									message: "主题颜色切换失败！",
								})
							} else {
								//修改全局主题颜色值
								this.$store.commit("setThemeColor", res.data.styleName)
							}
						})
						.catch((error) => {
							this.pageData.styleName = ""
						})
				} else {
					this.$message({
						type: "info",
						message: "请选择或新建页面后再操作！",
					})
					this.pageData.styleName = ""
				}
			},
			//切换页头显示
			changeHeaderShow() {
				if (this.pageId) {
					//保存页头显示切换
					this.axios({
							method: "patch",
							url: "/portal/api/pages/header/" + this.pageId + "/" + (this.pageData.header ? 1 : 0),
						})
						.then((res) => {
							if (!res || !res.data) {
								this.pageData.header = !this.pageData.header
								this.$message({
									type: "error",
									message: "页头显示切换失败！",
								})
							}
						})
						.catch((error) => {
							this.pageData.header = !this.pageData.header
						})
				} else {
					this.$message({
						type: "info",
						message: "请选择或新建页面后再操作！",
					})
					this.pageData.styleName = ""
				}
			},
			//切换页脚显示
			changeFooterShow() {
				if (this.pageId) {
					//保存页头显示切换
					this.axios({
							method: "patch",
							url: "/portal/api/pages/footer/" + this.pageId + "/" + (this.pageData.footer ? 1 : 0),
						})
						.then((res) => {
							if (!res || !res.data) {
								this.pageData.footer = !this.pageData.footer
								this.$message({
									type: "error",
									message: "页头显示切换失败！",
								})
							}
						})
						.catch((error) => {
							this.pageData.footer = !this.pageData.footer
						})
				} else {
					this.$message({
						type: "info",
						message: "请选择或新建页面后再操作！",
					})
					this.pageData.styleName = ""
				}
			}
		},
		mounted: function() {
			//获取数据字典项
			this.fetchDict()
		}
	}
</script>

<style lang="scss" scoped>
	.el-form {

		/deep/ .el-form-item__label {
			color: inherit;
		}

		/deep/ .el-form-item {
			margin-bottom: 0;
		}
	}
</style>
