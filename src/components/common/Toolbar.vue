<!-- 工具栏 -->
<template>
	<div id="toolBar" class="toolbar">
		<p class="now-page-name" @click="savePageDia = true" :title="pageName">{{pageName}}</p>
		<!-- 页面设置组件 -->
		<PageSetup :pageData="pageData" :grid="grid"></PageSetup>
		<el-form class="module-resource" label-width="80px">
			<el-form-item label="模块">
				<span :class="['add-module','iconfont', isAddModule?'el-icon-close':'iconxinzeng']" size="mini" circle
				 @click.stop.prevent="addModule" :title="isAddModule?'取消':'添加模块'"></span>
			</el-form-item>
			<el-form-item label="资源">
				<span class="iconfont iconwenjianjia1" size="mini" circle @click="grid.drawer=true" title="选择资源"></span>
			</el-form-item>
		</el-form>
		<div id="toolBox">
			<!-- 模板来源Id不存在的时候，没有一键还原按钮 -->
			<div class="toolItem" v-for="(item, index) in bars" :key="index" v-if="!(item.btn=='restore' && !templateId)" @click="item.clickAffair(item.name)">
				<span class="iconfont" :class="item.icon" :title="item.name"></span>
			</div>
		</div>
		<!-- 我的页面弹窗 -->
		<el-dialog :visible.sync="myPageDiaVisible" width="600px">
			<span slot="title" class="el-dialog__title">{{ dialogTitle }}</span>
			<div class="dialogWrap">
				<div class="pageItem div-column" v-for="(item,index) in myPageContent" :key="index">
					<!-- <div class="pageItem"> -->
					<p class="pageTitle text-ellipsis" v-if="item.enable=='1'" :title="item.pageName">
						<span class="iconfont iconshixinyuanxing greenTag"></span>{{item.pageName}}
					</p>
					<p class="pageTitle text-ellipsis" v-else :title="item.pageName">
						<span class="iconfont iconshixinyuanxing redTag"></span>{{item.pageName}}
					</p>
					<p class="alActive pageStatus" v-if="item.enable=='1'">已启用</p>
					<el-button class="noActive pageStatus" @click="activePage(item.id)" style="margin-left:0" v-else>激活</el-button>
					<el-button icon="el-icon-edit" circle title="编辑" @click="editPage(item.id,item.pageName)"></el-button>
					<el-popconfirm confirm-button-text='好的' cancel-button-text='不用了' @confirm="deletePage(item.id)" icon="el-icon-info"
					 icon-color="red" title="确定删除该页面么？">
						<el-button icon="el-icon-delete" title="删除" circle :plain="true" slot="reference"></el-button>
					</el-popconfirm>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="myPageDiaVisible = false">确定</el-button>
			</span>
		</el-dialog>
		<!-- 选择模板弹窗 -->
		<el-dialog :visible.sync="chooseMDiaVisible" width="600px">
			<span slot="title" class="el-dialog__title">{{ dialogTitle }}</span>
			<div class="modules">
				<template>
					<div class="RoleModules" v-for="(itemRole,key) in roleModule" :key="key">
						<p>角色：{{key}}</p>
						<el-radio-group v-model="moduleRadio" class="moduleRadio">
							<el-radio v-for="(item,index) in itemRole" :key="index" :label="item.pageId" class="moduleItem" @change="getModuleData(item)"
							 :title="(item.pageName||'')">{{item.pageName}}</el-radio>
						</el-radio-group>
					</div>
				</template>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="UseModule()">使用此模板</el-button>
			</span>
		</el-dialog>
		<!-- 保存模板弹窗 -->
		<el-dialog :visible.sync="saveVisible" width="600px">
			<span slot="title" class="el-dialog__title">{{ dialogTitle }}</span>
			<el-form ref="form" label-width="50px">
				<el-form-item label="名称:" class="newPage">
					<el-input class="saveInput" v-model="saveModuleName" placeholder="请输入内容"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveModule()">确定</el-button>
				<el-button @click="saveVisible = false">取消</el-button>
			</span>
		</el-dialog>
		<!-- 修改页面名称弹窗 -->
		<el-dialog :visible.sync="savePageDia" width="600px">
			<span slot="title" class="el-dialog__title">修改页面名称</span>
			<el-form ref="form" label-width="50px">
				<el-form-item label="名称:" class="newPage">
					<el-input class="saveInput" v-model="pageName" placeholder="请输入页面名称"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="savePageName()">确定</el-button>
				<el-button @click="savePageDia = false">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "ToolBar",
		props: {
			//页面数据
			pageData: Object,
			//栅格
			grid: Object,
			//是否新增模块
			isAddModule: Boolean
		},
		// props: ['pageData', 'isAddModule'], //pageData：页面数据、isAddModule：是否新增模块
		data() {
			return {
				bars: [{
						btn: "myPage",
						icon: "iconxuanze2",
						name: "我的页面",
						clickAffair: this.myPage
					},
					{
						btn: "chooseModule",
						icon: "iconbuoumaotubiao25",
						name: "选择模板",
						clickAffair: this.chooseModule
					},
					// {
					// 	btn: "newBuilt",
					// 	icon: "iconxinjian",
					// 	name: "新建页面",
					// 	clickAffair: this.newBuilt
					// },
					// {
					// 	btn: "cleanUp",
					// 	icon: "iconqingkong",
					// 	name: "清空",
					// 	clickAffair: this.cleanUp
					// },
					{
						btn: "restore",
						icon: "iconhuanyuan",
						name: "还原",
						clickAffair: this.restore
					},
					{
						btn: "preview",
						icon: "iconyulan1",
						name: "预览",
						clickAffair: this.preview
					},
				],
				//当前激活页面Id
				enablePageId: "",
				//我的页面dialog是否显示
				myPageDiaVisible: false,
				//我的页面content
				myPageContent: [],
				//选择模板dialog是否显示
				chooseMDiaVisible: false,
				//当前选择模板
				nowModule: {},
				//角色模板Content
				roleModule: [],
				//是否保存新页面dialog
				saveVisible: false,
				//新模板的模板名
				saveModuleName: "",
				// dailog的title
				dialogTitle: "",
				//选择哪一个模板
				moduleRadio: "",
				//新建页面提示内容
				newPageContent: "",
				//修改页面名称
				savePageDia: false,
			}
		},
		computed: {
			//页面id
			pageId() {
				return this.$store.state.pageId
			},
			//页面名称
			pageName() {
				return this.$store.state.pageName
			},
			//来源模板Id
			templateId() {
				return this.$store.state.templateId
			}
		},
		components: {
			//页面设置部分
			PageSetup: (resolve) => {
				require(["./PageSetup.vue"], resolve)
			},
		},
		methods: {
			//我的页面弹窗
			myPage(title) {
				this.myPageDiaVisible = true
				this.dialogTitle = title
				//获取页面列表
				this.getPage()
				return false
			},
			//激活页面
			activePage(id) {
				this.axios
					.patch("/portal/api/pages/" + id)
					.then((res) => {
						this.$message({
							message: "激活成功",
							type: "success",
						})
						//更新页面列表
						this.getPage()
					})
					.catch((err) => {
						console.log(err)
					})
				return false
			},
			//获取页面
			getPage() {
				//清空页面列表
				this.myPageContent = []
				//获取页面列表数据
				this.axios.get("/portal/api/pages/userall")
					.then((res) => {
						if (res.data && res.data.length > 0) {
							res.data.map((item, index) => {
								//激活页面id
								if (item.enable == "1") {
									this.enablePageId = item.id
								}
								//页面列表数据更新
								if (item.type == "page" || item.type == "PAGE") {
									this.myPageContent.push(item)
								}
							})
						}
					})
					.catch((err) => {
						console.log(err)
					})
			},
			//编辑选中页面
			editPage(id, name) {
				//更新当前操作页面ID
				this.$store.commit("setPageId", id)
				//更新当前页面名称
				this.$store.commit("setPageName", name)
				//设置当前页面正在编辑
				this.$store.commit("setEditingPageState", true)
				//初始化当前页面
				this.$emit("initPage")
				// ev.target.blur()
				this.myPageDiaVisible = false
				return false
			},
			//删除选中页面
			deletePage(id, ev) {
				this.deleteMypage = true
				this.axios
					.delete("/portal/api/pages/deletePage", {
						params: {
							ids: id,
						},
					})
					.then((res) => {
						this.$message({
							message: "删除成功",
							type: "success",
						})
						//若删除的是当前正在编辑的页面,删除后默认展示激活页面，若没有则是空
						if (this.pageId == id) {
							//设置当前页面id为激活页面id
							this.$store.commit("setPageId", this.enablePageId)
							//初始化当前页面
							this.$emit("initPage")
						}
						//更新页面列表
						this.getPage()
					})
					.catch((err) => {
						console.log(err)
					})
				return false
			},
			//选择模板弹窗
			chooseModule(title) {
				this.chooseMDiaVisible = true
				this.dialogTitle = title
				this.getRoleModule()
			},
			//获取角色模板
			getRoleModule() {
				this.roleModule = []
				this.axios
					.get("/portal/api/pages/roles/pages")
					.then((res) => {
						if (res.data) {
							this.roleModule = res.data
						}
					})
					.catch((err) => {
						console.log(err)
					})
			},
			//获取当前模板数据
			getModuleData(datas) {
				this.nowModule = datas
			},
			//使用此模板
			UseModule() {
				this.saveVisible = true
				this.saveModuleName = this.nowModule.pageName
				return false
			},
			//保存此模板
			saveModule() {
				this.saveVisible = false
				this.chooseMDiaVisible = false
				this.nowModule.pageName = this.saveModuleName
				//2020-11-27 改为post方式，路径后拼接参数
				this.axios.post("/portal/api/pages/template/newpage/" +
						this.nowModule.pageId + "/" +
						this.nowModule.pageName)
					.then((res) => {
						this.$message({
							message: "保存成功",
							type: "success",
						})
						if (res.data) {
							//更新当前操作页面ID
							this.$store.commit("setPageId", res.data)
						}
						//更新当前页面名称
						this.$store.commit("setPageName", this.nowModule.pageName)
						//设置当前页面正在编辑
						this.$store.commit("setEditingPageState", true)
						//初始化当前页面
						this.$emit("initPage")
					})
					.catch((err) => {
						console.log(err)
					})
			},
			//新建
			newBuilt(title) {
				if (this.$store.state.editingPage) {
					this.newPageContent = "确定新建一个页面吗？"
				} else {
					this.newPageContent = "确定取消目前编辑页并新建一个页面吗？"
				}
				this.$confirm(this.newPageContent, "确认", {
						confirmButtonText: "确认",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						this.axios
							.post("/portal/api/pages", {
								id: "",
								type: "",
								affiliationId: "",
								styleName: "",
								pageName: "新建页面",
								fontSize: "",
								enable: 0,
							})
							.then((res) => {
								if (res && res.data) {
									//更新当前操作页面ID
									this.$store.commit("setPageId", res.data.id)
									//更新当前页面名称
									this.$store.commit("setPageName", res.data.pageName)
									//设置当前页面正在编辑
									this.$store.commit("setEditingPageState", true)
									//初始化当前页面
									this.$emit("initPage")
									this.$message({
										message: "新建成功",
										type: "success",
									})
								}
							})
							.catch((err) => {
								console.log(err)
							})
					})
					.catch(() => {
						this.$message({
							message: "取消新建",
						})
					})
			},
			//清空
			cleanUp() {
				if (this.pageId) {
					this.$confirm("确定清空当前页面吗？", "确认", {
							confirmButtonText: "确认",
							cancelButtonText: "取消",
							type: "warning",
						})
						.then(() => {
							this.axios.put("/portal/api/pages/clearpage/" + this.pageId)
								.then((res) => {
									//初始化当前页面
									this.$emit("initPage")
								})
								.catch((err) => {
									console.log(err)
								})
						})
						.catch(() => {
							this.$message({
								message: "取消清空",
							})
						})
				} else {
					this.$message({
						type: "info",
						message: "请选择或新建页面后再操作！",
					})
				}
			},
			//还原模板页面
			restore() {
				if (this.pageId) {
					if (this.templateId) {
						this.$confirm("是否确定还原当前页面到原模板页面？", "确定", {
								confirmButtonText: "确认",
								cancelButtonText: "取消",
								type: "warning",
							})
							.then(() => {
								this.axios.put("/portal/api/pages/rollblocktemplate/" + this.pageId)
									.then((res) => {
										if (res.data) {
											//设置当前页面正在编辑
											this.$store.commit("setEditingPageState", true)
											//初始化当前页面
											this.$emit("initPage")
											this.$message({
												type: "success",
												message: "还原成功",
											})
										}
									})
									.catch((err) => {
										console.log(err)
									})
							})
							.catch(() => {
								this.$message({
									message: "取消还原",
								})
							})
					} else {
						this.$message({
							type: "info",
							message: "还原失败，该页面没有来源模板"
						})
					}
				} else {
					this.$message({
						type: "info",
						message: "请选择页面后再操作！",
					})
				}
			},
			//预览
			preview() {
				if (this.pageId) {
					//跳转预览
					this.$router.push({
						name: "index",
						query: {
							preview: true,
						},
						// params: {
						// 	preview: true
						// },
					})
					// let routeUrl = this.$router.resolve({
					// 	name: 'index',
					// 	query: {
					// 		preview: true
					// 	},
					// });
					// window.open(routeUrl.href, '_blank');
				} else {
					this.$message({
						type: "info",
						message: "请选择或新建页面后再操作！",
					})
				}
				return false
			},
			//修改页面名称
			savePageName() {
				this.axios
					.put("/portal/api/pages/pagename", {
						pageId: this.pageId,
						pageName: this.pageName,
					})
					.then((res) => {
						this.savePageDia = false
					})
					.catch((err) => {
						console.log(err)
					})
			},
			//添加模块
			addModule(e) {
				// 修改父组件的变量值
				if (this.isAddModule) {
					this.$emit('update:isAddModule', false)
				} else {
					//鼠标十字瞄准
					this.$emit('update:isAddModule', true)
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.toolbar {
		height: $toolbarHeight;
		line-height: $toolbarHeight;
		background-color: $mainColor;
		overflow: hidden;
		border-bottom: 1px solid $subColor1;

		/* 页面名称 */
		.now-page-name {
			display: inline-block;
			cursor: pointer;
			margin-left: 20px;
		}

		/* 页面设置部分 */
		/deep/>.el-form {
			display: inline-block;

			/deep/ .el-form-item {
				display: inline-block;
				margin-bottom: 0 !important
			}

			/deep/ .el-form-item__label {
				color: inherit;
			}
		}

		/* 模块和资源操作按钮 */
		.module-resource {
			margin-left: 20px;

			span {
				font-size: 20px;
				cursor: pointer;
				color: $fontColor3;
			}

			span:hover {
				color: $subColor3;
			}
		}

		/* 工具按钮组 */
		#toolBox {
			display: flex;
			float: right;

			.toolItem {
				margin-right: 20px;
				cursor: pointer;
			}

			.toolItem:hover .iconfont {
				color: $subColor3;
				-webkit-transition: 0.2s linear;
				-moz-transition: 0.2s linear;
				-ms-transition: 0.2s linear;
				-o-transition: 0.2s linear;
				transition: 0.2s linear;
			}
		}
	}

	.iconfont {
		color: $fontColor3;
		font-size: 20px;
	}

	/* 我的页面弹出框 */
	.dialogWrap {
		height: 300px;
		overflow: auto;

		.pageItem {
			display: flex;
			margin-bottom: 10px;
		}

		.pageTitle {
			width: 320px;

			>span {
				margin-right: 5px;
			}
		}

		.pageStatus {
			width: 70px;
			text-align: center;
			margin-left: 0;
			margin-right: 10px;
		}

		.noActive {
			cursor: pointer;
			margin-right: 10px;
		}

		.greenTag {
			color: #3dcd04;
			vertical-align: middle;
		}

		.redTag {
			color: red;
			vertical-align: middle;
		}

		.el-button {
			margin-left: 20px;
		}
	}

	.moduleItem {
		margin-bottom: 15px;
	}

	.moduleRadio {
		margin-left: 20px;
	}

	.newPage p {
		text-align: center;
	}
</style>
