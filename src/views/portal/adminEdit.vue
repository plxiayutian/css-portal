<template>
	<el-container v-loading="fullscreenLoading" :element-loading-text="loadingName" element-loading-spinner="el-icon-loading"
	 element-loading-background="rgba(0, 0, 0, 0.8)" id="appEdit" @mouseup.native="closeModuleMouseMove">
		<el-header>
			<!-- 使用工具栏 -->
			<AdminToolbar @initPage='initPage'></AdminToolbar>
		</el-header>
		<el-container class="page-content">
			<el-main class="page-main">
				<!-- 页头 -->
				<header v-if="pageData.header">
					<Header></Header>
				</header>
				<div id="pageArea" ref="pageArea" :class="['page-area', { crosshair: isAddModule }]">
					<template v-if="editingPage">
						<!-- row对应y,col对应x -->
						<el-row v-for="(item, index1) in grid.rows" :key="'row'+index1" :style="'height:'+grid.rowHeight">
							<el-col :span="1" v-for="(item, index2) in grid.cols" :lang="'(' + index2 + ',' + index1 + ')'" :key="'col'+index2"
							 @mousedown.native="moduleMouseDown(index2,index1)" @mouseenter.native="moduleMouseMove(index2,index1)"
							 @mouseup.stop.native="moduleMouseUp"></el-col>
						</el-row>

						<!-- 展示的模块或模块及资源--无工具栏--不可拖拽 -->
						<div v-for="(item,index) in showModuleArr" :key="'showModule_'+index">
							<div :id="item.id" class="module_style" :style="{ top: item.curTop,left: item.curLeft,width: item.curWidth,height: item.curHeight }">
								<div class="module_name_wrap">
									<span v-show="item.showModuleName" :id="'isTextModuleName_'+ item.id" class="module_name_text">{{ item.moduleName }}</span>
									<span v-show="item.showModuleName" :id="'isHideModuleName_'+ item.id" class="module_name_text_tool el-icon-arrow-left"
									 @click="hiddenModuleName(item,index)"></span>
									<span v-show="!item.showModuleName" :id="'isShowModuleName_'+ item.id" class="module_name_text_tool el-icon-arrow-right"
									 @click="showModuleName(item,index)"></span>
								</div>
								<component :is="item.draggableElement.draggableElementType" :moduleId="item.draggableElement.draggableModuleId"></component>
								<div class="module_tools">
									<span v-if="item.isLocked=='1'" class="el-icon-lock" @click="changeModuleLock(item,index)" title="解除模块锁定"></span>
									<span v-else class="el-icon-unlock" @click="changeModuleLock(item,index)" title="锁定模块"></span>
									<span class="el-icon-close" @click="deleteResource(item)" title="删除资源"></span>
								</div>
							</div>
						</div>

						<!-- 编辑的模块--有工具栏--不可拖拽 -->
						<div v-for="(item,index) in addModuleArr" :key="'addModule_'+index">
							<div :id="item.id" class="module_style" :style="{ top: item.curTop,left: item.curLeft,width: item.curWidth,height: item.curHeight }">
								<div class="module_name_wrap">
									<input :id="'isInputModuleName_'+ item.id" class="module_name_input" type="text" placeholder="请输入模块名称" v-model="item.moduleName" />
								</div>
								<div :id="'tool_'+ item.id" class="module_tool_btns">
									<div :id="'save_'+ item.id" class="module_tool_save el-icon-check" @click="moduleToolSave(item)" title="确认"></div>
									<div :id="'delete_'+ item.id" class="module_tool_delete el-icon-close" @click="moduleToolDelete(item)" title="删除"></div>
								</div>
							</div>
						</div>

						<!-- 编辑的模块--无工具栏--可拖拽 -->
						<div v-for="(item,index) in editModuleArr" :key="'editModule_'+index">
							<draggable :list="item[index]" group="id" :id="item.id" class="module_style" :style="{ top: item.curTop,left: item.curLeft,width: item.curWidth,height: item.curHeight }">
								<div class="module_name_wrap">
									<span :id="'isTextModuleName_'+ item.id" class="module_name_text">{{ item.moduleName }}</span>
								</div>
								<div class="module_tools">
									<span v-if="item.isLocked=='1'" class="el-icon-lock" @click="changeModuleLock(item,index)" title="解除模块锁定"></span>
									<span v-else class="el-icon-unlock" @click="changeModuleLock(item,index)" title="锁定模块"></span>
								</div>
							</draggable>
						</div>
					</template>
				</div>
				<!-- 页脚 -->
				<footer v-if="pageData.footer">
					<Footer></Footer>
				</footer>
			</el-main>
			<el-aside v-show="this.$store.state.pageId">
				<div class="handle-button" @click="handleAside">
					<i :class="aside.btnIcon"></i>
				</div>
				<div :class="['aside-content', { show: aside.isOpen }]">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>页面设置</span>
						</div>
						<!-- 页面设置组件 -->
						<PageSetup :pageData="pageData"></PageSetup>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix div-column">
							<span>布局</span>
							<el-button :class="['add-module', isAddModule?'el-icon-close':'el-icon-plus']" size="mini" circle
							 @click.stop.prevent="addModule" :title=" isAddModule?'取消':'添加模块'"></el-button>
						</div>
						<ul class="module-list">
							<li v-for="(item, index) in pageData.arrModule" :key="'module'+index">
								<el-row class="div-column">
									<el-col :span="20" class="module-name" :title="item.moduleName||''">
										<!-- Enter键保存： -->
										<el-input v-if="item.isEdit" class="inline-input moduleName" size="mini" v-model="item.moduleName"
										 placeholder="请输入模块名称" @keyup.enter.native="enterModuleName" @blur.stop="blurModuleName(item,index)"></el-input>
										<div v-else class="text-ellipsis" @click.stop="handleModuleName(index)">{{item.moduleName || ""}}</div>
									</el-col>
									<el-col :span="4" class="module-icon">
										<el-popconfirm title="请确认是否删除？" @confirm="delModule(item)">
											<i class="el-icon-delete" slot="reference"></i>
										</el-popconfirm>
									</el-col>
								</el-row>
								<ul class="module-content" v-if="item.resourceEntity && item.resourceEntity.id">
									<li>
										<el-row class="div-column">
											<el-col :span="20" class="module-name text-ellipsis" :title="item.resourceEntity.name||''">{{item.resourceEntity.name || ""}}</el-col>
											<el-col :span="4" class="module-icon">
												<el-popconfirm title="请确认是否删除？" @confirm="delResource(item.moduleId)">
													<i class="el-icon-delete" slot="reference"></i>
												</el-popconfirm>
											</el-col>
										</el-row>
									</li>
								</ul>
							</li>
						</ul>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix resource-search">
							<p>
								<span>资源</span>
								<el-autocomplete popper-class="my-autocomplete" v-model="searchResInput" :fetch-suggestions="querySearch"
								 placeholder="请输入内容" size="mini" clearable>
									<template slot-scope="{ item }">
										<div class="name">{{ item.value}}</div>
									</template>
								</el-autocomplete>
								<el-button icon="el-icon-search" circle @click="searchRes" title="搜索" size="mini"></el-button>
							</p>
						</div>
						<el-collapse id="resource-list" class="resource-list" @change="handleResourceChange">
							<el-collapse-item v-for="(item,key) in objResource" :key="'res'+key" :title="resourceType[key]" :name="key">
								<draggable :list="item.data" :group="{ name: 'id', pull: 'clone', put: false }" @start="dragStart" @end="dragEnd">
									<transition-group>
										<div class="resource-item text-ellipsis" v-for="(reItem,reIndex) in item" :data-id="reItem.id" :data-type="reItem.type"
										 :key="key +''+ reIndex" :title="reItem.name">
											{{reItem.name}}
										</div>
									</transition-group>
								</draggable>
							</el-collapse-item>
						</el-collapse>
					</el-card>
				</div>
			</el-aside>
		</el-container>
	</el-container>
</template>

<script>
	// 引入js组件
	import selectArea from "../../plugins/selectArea.js"
	export default {
		name: "adminEdit",
		data() {
			return {
				// 加载状态
				fullscreenLoading: false,
				// 加载时显示内容
				loadingName: "加载中，请稍后...",
				// 选择区域
				selectArea: selectArea,
				// 默认栅格数
				gridRows: 16,
				// 栅格
				grid: {
					cols: 24, //列数,最大24列
					rows: 16, //行数，默认16行，1080
					colWidth: "4.16667%", // 每行宽度
					rowHeight: "50px", // 每行高度
				},
				// 右侧面板设置
				aside: {
					iconOpen: "el-icon-setting", //设置图标
					iconClose: "el-icon-close", //关闭图标
					btnIcon: "el-icon-close",
					isOpen: true, //是否打开设置
				},
				// 当前页面数据
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
					arrModule: [],
				},
				// 是否正在添加模块
				isAddModule: false,
				// 是否拖动选择栅格
				isMoved: false,
				// 展示的模块或模块及资源--无工具栏--有或无资源
				showModuleArr: [],
				// 编辑的模块--有工具栏--无资源
				addModuleArr: [],
				// 编辑的模块--无工具栏--无资源
				editModuleArr: [],
				// 拖拽元素类型和id
				draggableElement: {
					draggableElementType: "",
					// draggableElementId: '',
					draggableModuleId: "",
					draggableResourceId: "",
					draggableResourceName: ""
				},
				// 数据字典资源类型
				resourceType: {},
				// 资源列表数据
				objResource: {},
				// 右侧资源折叠面板初始高度
				resourceH: 270,
				// 右侧搜索资源
				searchResInput: '',
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
			//是否正在编辑页面
			editingPage() {
				//默认不是编辑状态
				return this.$store.state.editingPage || false
			}
		},
		components: {
			// 组件懒加载
			//头部工具栏
			AdminToolbar: (resolve) => {
				require(["../../components/AdminToolbar.vue"], resolve)
			},
			//页面设置部分
			PageSetup: (resolve) => {
				require(["../../components/PageSetup.vue"], resolve)
			},
			//页头
			Header: (resolve) => {
				require(["../../components/Header.vue"], resolve)
			},
			//页脚
			Footer: (resolve) => {
				require(["../../components/Footer.vue"], resolve)
			},
			//轮播图
			carousel: (resolve) => {
				require(["../../components/Carousel.vue"], resolve)
			},
			//列表
			list: (resolve) => {
				require(["../../components/List.vue"], resolve)
			},
			//拖拽组件
			draggable: (resolve) => {
				require(["vuedraggable"], resolve)
			}
		},
		methods: {
			// 全局设置选择除栅格区域外的事件
			closeModuleMouseMove() {
				//新增模块，栅格画模块--鼠标抬起事件
				this.moduleMouseUp()
			},
			//点击资源展开面板
			handleResourceChange(val) {
				let resList = document.getElementById("resource-list")
				let resH = 0
				for (let i = 0; i < val.length; i++) {
					resH += this.objResource[val[i]].length
				}
				resList.style.height = this.resourceH + 28 * resH + "px"
			},
			// 右侧面板设置按钮切换事件
			handleAside() {
				if (this.aside.isOpen) {
					this.aside.isOpen = false
					this.aside.btnIcon = this.aside.iconOpen
				} else {
					this.aside.isOpen = true
					this.aside.btnIcon = this.aside.iconClose
				}
			},
			//获取数据字典项
			fetchDict() {
				this.axios
					.get("/portal/api/commons/dictitembydictcode", {
						params: {
							dictCodes: "resource_type", //获取字号、主题颜色、资源类型字典项
						},
					})
					.then((res) => {
						if (res && res.data) {
							let arrResourceType = res.data.resource_type
							//资源类型
							if (arrResourceType && arrResourceType.length > 0) {
								arrResourceType.map((item, index) => {
									this.resourceType[item.dictItemCode] = item.dictItemName
								})
							}
						}
					})
					.catch((error) => {
						console.log(error)
					})
			},
			//页面初始化
			initPage() {
				// 清空页面信息
				this.clearPage()
				//获取页面数据
				this.fetchPageData()
				//获取模块数据
				this.fetchModuleData(this.pageId, true)
				//设置默认栅格数
				this.grid.rows = this.gridRows
			},
			// 清空页面
			clearPage() {
				this.addModuleArr = []
				this.editModuleArr = []
				this.showModuleArr = []
			},
			// 初始化模块
			initModule(data) {
				// 初始化页面--模块
				this.selectArea.calculateGrid(
					this.grid.colWidth,
					this.grid.rowHeight
				)
				// 判断模块上有无资源
				if (data.portalResourceId) {
					this.showModuleArr.push(this.selectArea.init(data))
				} else {
					this.editModuleArr.push(this.selectArea.init(data))
				}
			},
			//获取页面数据
			fetchPageData() {
				this.axios.get("/portal/api/pages/" + this.pageId).then((res) => {
					if (res.data) {
						//页头显示
						res.data.header = res.data.header == "1" ? true : false
						//页脚显示
						res.data.footer = res.data.footer == "1" ? true : false
						//页面数据赋初值
						Object.assign(this.pageData, res.data)
						// 修改当前页面名称
						if (res.data.pageName && res.data.pageName != this.pageName) {
							this.$store.commit("setPageName", res.data.pageName)
						}
						// 修改全局来源模板Id
						if (res.data.templateId) {
							this.$store.commit("setTemplateId", res.data.templateId)
						}
						// 修改全局主题颜色值
						if (res.data.styleName && res.data.styleName != this.themeColor) {
							this.$store.commit("setThemeColor", res.data.styleName)
						}
						// 修改全局字号
						if (res.data.fontSize && res.data.fontSize != this.fontSize) {
							this.$store.commit("setFontSize", res.data.fontSize)
						}
					} else {
						//页面数据初始值
						Object.assign(this.pageData, {
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
						})
						// 修改当前页面名称
						this.$store.commit("setPageName", "")
						// 修改全局来源模板Id
						this.$store.commit("setTemplateId", "")
						// 修改全局主题颜色
						this.$store.commit("setThemeColor", "")
						// 修改全局字号
						this.$store.commit("setFontSize", "")
					}
				})
			},
			/* 获取模块数据
			 ** pageId：页面Id
			 ** initModule：是否加载模块
			 */
			fetchModuleData(pageId, initModule) {
				this.axios
					.get("/portal/api/modules/" + pageId + "/module/resource")
					.then((res) => {
						if (res.data) {
							if (res.data.length > 0) {
								res.data.map((item, index) => {
									if (initModule) {
										this.initModule(item)
									}
									//默认加不是正在编辑状态
									if (item) {
										item.isEdit = false
									}
								})
							}
							this.pageData.arrModule = res.data
						}
					})
			},
			//添加模块
			addModule(e) {
				if (this.isAddModule) {
					this.isAddModule = false
				} else {
					//鼠标十字瞄准
					this.isAddModule = true
				}
			},
			//点击修改模块名称
			handleModuleName(index) {
				this.$set(this.pageData.arrModule[index], "isEdit", true)
			},
			//Enter键控制失去焦点走保存事件
			enterModuleName(e) {
				//事件兼容写法
				let event = e || window.event;
				let target = event.target || event.srcElement;
				if (target && target.blur) {
					target.blur() //控制输入框失去焦点
				}
			},
			//模块名称输入框失去焦点事件
			blurModuleName(item, index) {
				this.$set(this.pageData.arrModule[index], "isEdit", false)
				//保存模块名称修改
				this.handleSaveModuleName(item)
			},
			//保存模块名称修改
			handleSaveModuleName(item) {
				if (item.moduleId) {
					this.axios({
							method: "put",
							url: "/portal/api/modules/modulename/",
							data: {
								moduleId: item.moduleId,
								moduleName: item.moduleName,
							}
						})
						.then((res) => {
							if (res.data) {
								let moduleArr,
									selectedModuleId = item.moduleId,
									changeModuleName = res.data.moduleName
								// 判断有无资源
								if (item.portalResourceId) {
									moduleArr = this.showModuleArr
								} else {
									moduleArr = this.editModuleArr
								}
								//改变页面上对应模块的模块名称
								moduleArr.map((list, index) => {
									if (list.id == selectedModuleId) {
										list.moduleName = changeModuleName
									}
								})
							}
							// else {
							// 	this.$message({
							// 		type: "error",
							// 		message: "模块名称修改失败！",
							// 	})
							// }
						})
						.catch((error) => {
							console.log(error)
						})
				}
			},
			/* 
			  切换模块锁定状态
			  @params:
				item:当前操作模块项
				index：当前操作模块索引
				none:是否是空模块
			 */
			changeModuleLock(item, index, none) {
				let strTitle = "" //提示信息
				let isLocked = 0 //模块是否锁定
				if (item.isLocked == '1') {
					strTitle = "请确认是否解除该模块锁定？"
					isLocked = '0' //锁定状态，0（未锁定）、1（锁定）
				} else {
					strTitle = "请确认是否锁定该模块？"
					isLocked = '1' //锁定状态，0（未锁定）、1（锁定）
				}
				this.$confirm(strTitle, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						this.axios({
							method: "patch",
							url: "/portal/api/modules/" + item.id + "/" + isLocked,
						}).then((res) => {
							//修改当前模块的锁定图标
							item.isLocked = isLocked
							// if (!none) {
							// 	this.$set(this.showModuleArr[index], index, item)
							// } else { //空模块
							// 	this.$set(this.editModuleArr[index], index, item)
							// }
							this.$message({
								type: "success",
								message: isLocked == '1' ? "锁定成功!" : "解锁成功!"
							})
							//重新获取右侧模块面板数据
							this.fetchModuleData(this.pageId, false)
						})
					})
			},
			// 删除模块
			delModule(item) {
				if (item.isLocked == "1") {
					this.$message({
						type: "warning",
						message: "锁定模块不可删除！",
					})
					return false
				}
				this.fullscreenLoading = true
				this.loadingName = "删除模块中，请稍后..."
				this.axios({
					method: "delete",
					url: "/portal/api/modules/" + item.moduleId,
				}).then((res) => {
					if (res.data) {
						this.$message({
							type: "success",
							message: "删除模块成功！",
						})
						// 页面上删除模块
						if (item.resourceId) {
							// 有资源
							this.showModuleArr.map((list, index) => {
								if (list.id == item.moduleId) {
									this.showModuleArr.splice(index, 1)
								}
							})
						} else {
							// 无资源
							this.editModuleArr.map((list, index) => {
								if (list.id == item.moduleId) {
									this.editModuleArr.splice(index, 1)
								}
							})
						}
						this.fullscreenLoading = false
						//重新获取右侧模块面板数据
						this.fetchModuleData(this.pageId, false)
					} else {
						this.$message({
							type: "error",
							message: "删除模块失败！",
						})
					}
				})
			},
			// 删除模块下挂载的资源
			delResource(moduleId) {
				this.axios({
					method: "delete",
					url: "/portal/api/modules/module/resource/" + moduleId,
				}).then((res) => {
					if (res.data) {
						this.$message({
							type: "success",
							message: "删除资源成功！",
						})
						// 页面上删除模块上资源
						this.showModuleArr.map((item, index) => {
							if (item.id == moduleId) {
								this.editModuleArr.push(this.showModuleArr[index])
								this.showModuleArr.splice(index, 1)
							}
						})
						//获取模块数据
						this.fetchModuleData(this.pageId, false)
					} else {
						this.$message({
							type: "error",
							message: "删除资源失败！",
						})
					}
				})
			},
			// 获取资源列表数据
			fetchResource() {
				this.axios
					.get("/portal/api/resources/role")
					.then((res) => {
						if (res.data) {
							let objResData = res.data
							// 过滤掉没有数据的资源类型
							for (let key in objResData) {
								if (!objResData[key] || objResData[key].length == 0) {
									delete objResData[key]
								}
							}
							this.objResource = objResData
						}
					})
					.catch((error) => {
						console.log(error)
					})
			},
			// 栅格画模块--鼠标按下事件
			moduleMouseDown(x, y) {
				if (this.isAddModule) {
					this.selectArea.mousedown(x, y, this.isAddModule)
				}
			},
			// 栅格画模块--鼠标移动事件
			moduleMouseMove(x, y) {
				if (this.isAddModule) {
					this.selectArea.mouseenter(x, y)
					//是否拖动选择栅格
					this.isMoved = true
				}
			},
			// 栅格画模块--鼠标抬起事件
			moduleMouseUp() {
				if (this.isAddModule && this.isMoved) {
					let addModuleData = {}
					addModuleData = this.selectArea.mouseup(
						this.grid.colWidth,
						this.grid.rowHeight,
						this.isAddModule
					)
					if (addModuleData.id) {
						addModuleData.moduleName = "新增模块" //设置默认新画的模块名称
						this.addModuleArr.push(addModuleData)
						this.isAddModule = false
					}
				}
				//是否拖动选择栅格
				this.isMoved = false
			},
			// 新创建模块工具栏--保存
			moduleToolSave(item) {
				//等待动画
				this.fullscreenLoading = true
				this.loadingName = "模块保存中，请稍后..."
				if (item) {
					item.portalPageId = this.pageId //模块关联页面id
					item.showModuleName = true //显示模块名称
				}
				//保存
				if (item) {
					this.axios.post("/portal/api/modules", item)
						.then((res) => {
							this.$message({
								type: "success",
								message: "模块保存成功!",
							})
							//获取模块数据
							this.fetchModuleData(this.pageId, false)
							//根据id匹配当前操作模块
							this.addModuleArr.map((itemModule, index) => {
								if (itemModule.id == item.id) {
									//添加到待编辑模块数据中
									itemModule.id = res.data.id
									this.editModuleArr.push(itemModule)
									//删除待添加模块中的数据
									this.addModuleArr.splice(index, 1)
								}
							})
							//关闭保存动画
							this.fullscreenLoading = false
						})
				}
			},
			// 新创建还未保存模块工具栏--删除
			moduleToolDelete(item) {
				this.$confirm("此操作将永久删除该模块, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						this.$message({
							type: "success",
							message: "删除成功!",
						})
						for (var i = 0; i < this.addModuleArr.length; i++) {
							if (this.addModuleArr[i].id == item.id) {
								this.addModuleArr.splice(i, 1)
							}
						}
					})
			},
			// 拖拽前事件
			dragStart(evt) {
				if (evt.item) {
					this.draggableElement.draggableElementType = evt.item.getAttribute("data-type")
					this.draggableElement.draggableResourceId = evt.item.getAttribute("data-id")
					this.draggableElement.draggableResourceName = evt.item.innerText
				}
			},
			// 拖拽后事件
			dragEnd(evt) {
				if (evt.to.className == "module_style") {
					let resourceId = this.draggableElement.draggableResourceId,
						resourceName = this.draggableElement.draggableResourceName,
						moduleId = evt.to.id
					this.draggableElement.draggableModuleId = moduleId
					this.axios({
						method: "patch",
						url: "/portal/api/modules/resource/" + moduleId + "/" + resourceId,
					}).then((res) => {
						if (res.data) {
							this.$message({
								type: "success",
								message: "添加资源成功!",
							})
							for (var i = 0; i < this.editModuleArr.length; i++) {
								if (this.editModuleArr[i].id == moduleId) {
									//当前操作模块添加到展示数据中
									this.editModuleArr[i]["draggableElement"] = this.draggableElement
									//模块名称
									this.editModuleArr[i].moduleName = resourceName
									this.showModuleArr.push(this.editModuleArr[i])
									//删除当前正在操作编辑的模块数据
									this.editModuleArr.splice(i, 1)
								}
							}
							//模块名称
							res.data.moduleName = resourceName
							//修改模块名称
							this.handleSaveModuleName(res.data)
							setTimeout(() => {
								//获取右侧面板模块数据
								this.fetchModuleData(this.pageId, false)
							}, 200)
						}
					})
				}
			},
			// 删除资源
			deleteResource(item) {
				// if (item.isLocked == "1") {
				// 	this.$message({
				// 		type: "warning",
				// 		message: "锁定模块不能操作",
				// 	})
				// } else {
				this.$confirm("是否删除已选资源？", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						this.delResource(item.id)
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
						})
					})
				// }
			},
			// 显示模块名称
			showModuleName(item, index) {
				item.showModuleName = true
				this.$set(this.showModuleArr, index, item)
			},
			// 隐藏模块名称
			hiddenModuleName(item, index) {
				item.showModuleName = false
				this.$set(this.showModuleArr, index, item)
			},
			//搜索资源
			searchRes() {
				this.axios
					.get("/portal/api/resources/bynameortype/", {
						params: {
							condition: this.searchResInput,
						},
					})
					.then((res) => {
						let searchRes = res.data
						// 过滤掉没有数据的资源类型
						for (let key in searchRes) {
							if (searchRes[key].length == 0) {
								delete searchRes[key]
							}
						}
						this.objResource = searchRes
					})
					.catch((err) => {})
			},
			/* 
			 搜索下拉框提示类型
			 @params
				queryString：输入框内容
				callback：回调函数
			 */
			querySearch(queryString, callback) {
				var searchTip = []
				for (let key in this.resourceType) {
					var itemTip = {}
					itemTip.value = this.resourceType[key]
					searchTip.push(itemTip)
				}
				var results = queryString ? searchTip.filter(this.createFilter(queryString)) : searchTip
				// 调用 callback 返回建议列表的数据
				callback(results)
			},
			createFilter(queryString) {
				return (result) => {
					return (
						result.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
					)
				}
			}
		},
		created: function() {},
		mounted: function() {
			//获取数据字典项
			this.fetchDict()
			//获取资源列表数据
			this.fetchResource()
			// 初始化页面
			if (this.editingPage) {
				this.initPage()
			}
		},
	}
</script>

<style lang="scss" scoped>
	#app {
		overflow: auto;
	}

	.el-container {
		height: 100%;
	}

	/* 需要使用scss的插值方式(#{$toolbarHeight})才能生效 */
	.page-content {
		height: -moz-calc(100% - #{$toolbarHeight} - 1px);
		height: -webkit-calc(100% - #{$toolbarHeight} - 1px);
		height: calc(100% - #{$toolbarHeight} - 1px);
	}

	.el-header {
		color: $fontColor;
		padding: 0;
		height: auto !important;
	}

	.page-main {
		//计算字号
		@include addFontSize($font-size-main);
		padding: 0;
		min-width: $page-width;
		background-color: $bgColor1;
	}

	/* 画模块部分 */
	/* 选中样式 */
	.td_change {
		background-color: black;
		opacity: 0.5;
	}

	/* 模板样式 */
	.module_style {
		position: absolute;
		border: 1px solid $subColor2;
		background: $bg-color;
		cursor: default;
	}

	/* 模板拖拽标题样式 */
	.module_style .resource-item {
		margin-top: 5%;
		text-align: center;
	}

	/* 模板名称框-样式 */
	.module_name_wrap {
		position: absolute;
		left: 0;
		top: 0;
		max-width: 80%;
		background: $bg-color2;
		z-index: 100;
		//透明度
		@include opacity(50);
	}

	/* 拖拽文件的名称 */
	.module_draggable_name {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: 10px;
		margin-left: 10px;
	}

	/* 右上角工具资源按钮 */
	.module_tools {
		position: absolute;
		top: 0;
		right: 0;
		background: $bg-color2;
		z-index: 100;
		padding: 0 5px;
		//透明度
		@include opacity(50);

		span {
			font-size: 20px;
			cursor: pointer;
		}

		span:hover {
			color: $hoverColor;
			transition: 0.2s linear;
		}

		.el-icon-lock {
			color: $hoverColor;
		}
	}

	/* 模块名称输入框 */
	.module_name_input {
		outline-style: none;
		border: 1px solid $border-color1;
		border-radius: 3px;
		padding: 5px 7px;
		width: 100%;
		font-size: 14px;
		font-weight: 700;
		font-family: "Microsoft soft";
	}

	.module_name_text {
		padding: 1px 7px;
		border-right: 1px solid $border-color1;
		font-size: 14px;
		font-weight: 700;
		font-family: "Microsoft soft";
	}

	.module_name_text_tool {
		cursor: pointer;
	}

	.module_name_text_tool:hover {
		background: $hoverColor;
	}

	/* 模板工具栏 */
	.module_tool_btns {
		position: absolute;
		right: 0;
		bottom: 0;
		border: 1px solid $subColor2;
		cursor: pointer;

		>div {
			float: left;
			padding: 3px;
		}

		>div:not(:last-child) {
			border-right: 1px solid $subColor2;
		}

		>div:hover {
			color: $subColor2;
		}
	}

	.resource-search {
		display: flex;

		.el-autocomplete {
			width: 180px;
			margin: 0 10px;
		}

		.my-autocomplete {
			li {
				line-height: normal;
				padding: 7px;
			}
		}
	}
</style>
