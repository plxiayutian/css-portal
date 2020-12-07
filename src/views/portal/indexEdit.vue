<template>
	<el-container v-loading="fullscreenLoading" :element-loading-text="loadingName" element-loading-spinner="el-icon-loading"
	 element-loading-background="rgba(0, 0, 0, 0.8)" id="appEdit" @mouseup.native="closeModuleMouseMove">
		<el-header>
			<!-- 使用工具栏 -->
			<Toolbar @initPage='initPage' :pageData="pageData" :grid="grid" :isAddModule.sync="isAddModule" :isAdmin="false"></Toolbar>
		</el-header>
		<el-container class="page-content">
			<el-main :class="['page-main',grid.drawer?'page-margin-bottom':'']">
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
							<!-- 锁定模块不可拖拽 -->
							<div v-if="item.isLocked=='1'" :id="item.id" class="module_style module-show" :style="{ top: item.curTop,left: item.curLeft,width: item.curWidth,height: item.curHeight }">
								<div class="module_name_wrap">
									<span v-show="item.showModuleName" :id="'isTextModuleName_'+ item.id" class="module_name_text">{{ item.moduleName }}</span>
									<span v-show="item.showModuleName" :id="'isHideModuleName_'+ item.id" class="module_name_text_tool el-icon-arrow-left"
									 @click="hiddenModuleName(item,index)"></span>
									<span v-show="!item.showModuleName" :id="'isShowModuleName_'+ item.id" class="module_name_text_tool el-icon-arrow-right"
									 @click="showModuleName(item,index)"></span>
								</div>
								<component :is="item.draggableElement.draggableElementType" :moduleId="item.draggableElement.draggableModuleId"
								 :type="item.draggableElement.draggableElementType" :title="item.moduleName"></component>
								<div class="module_tools">
									<span class="el-icon-lock" title="锁定模块" @click="moduleLockedTips(1)"></span>
								</div>
							</div>
							<!-- 未锁定模块可拖拽 -->
							<draggable v-else :list="item[index]" :group="{ name: 'resourceItem', pull: 'clone'}" @start="dragStart" @end="dragEnd"
							 :component-data="{attrs:{ locked: 0 }}" :id="item.id" class="module_style module-show" :style="{ top: item.curTop,left: item.curLeft,width: item.curWidth,height: item.curHeight }">
								<div class="module_name_wrap">
									<span v-show="item.showModuleName" :id="'isTextModuleName_'+ item.id" class="module_name_text">{{ item.moduleName }}</span>
									<span v-show="item.showModuleName" :id="'isHideModuleName_'+ item.id" class="module_name_text_tool el-icon-arrow-left"
									 @click="hiddenModuleName(item,index)"></span>
									<span v-show="!item.showModuleName" :id="'isShowModuleName_'+ item.id" class="module_name_text_tool el-icon-arrow-right"
									 @click="showModuleName(item,index)"></span>
								</div>
								<!-- 根据key值的改变动态重新渲染子组件 -->
								<component :key="item.id + item.draggableElement.draggableResourceId" :is="item.draggableElement.draggableElementType"
								 :moduleId="item.draggableElement.draggableModuleId" :type="item.draggableElement.draggableElementType" :title="item.moduleName"></component>
								<div class="module_tools">
									<!-- 没有来源模块才可以删除 -->
									<el-popconfirm v-if="!item.originModuleId" title="请确认是否删除模块？" @confirm="delModule(item,isModule=1)">
										<span class="el-icon-delete" title="删除模块" slot="reference"></span>
									</el-popconfirm>
								</div>
							</draggable>
						</div>

						<!-- 编辑的模块--有工具栏--不可拖拽 -->
						<div v-for="(item,index) in addModuleArr" :key="'addModule_'+index">
							<div :id="item.id" class="module_style module-add" :style="{ top: item.curTop,left: item.curLeft,width: item.curWidth,height: item.curHeight }">
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
							<!-- 锁定模块不可拖拽 -->
							<div v-if="item.isLocked=='1'" :list="item[index]" :id="item.id" class="module_style module-edit" :style="{ top: item.curTop,left: item.curLeft,width: item.curWidth,height: item.curHeight }">
								<div class="module_name_wrap">
									<span :id="'isTextModuleName_'+ item.id" class="module_name_text">{{ item.moduleName }}</span>
								</div>
								<div class="module_tools">
									<span class="el-icon-lock" title="锁定模块" @click="moduleLockedTips(1)"></span>
								</div>
							</div>
							<!-- 未锁定模块可拖拽 -->
							<draggable v-else :list="item[index]" group="resourceItem" draggable=".module-edit" :component-data="{attrs:{ locked: 0 }}"
							 :id="item.id" class="module_style module-edit" :style="{ top: item.curTop,left: item.curLeft,width: item.curWidth,height: item.curHeight }">
								<div class="module_name_wrap">
									<span :id="'isTextModuleName_'+ item.id" class="module_name_text">{{ item.moduleName }}</span>
								</div>
								<div class="module_tools">
									<!-- 没有来源模块才可以删除 -->
									<el-popconfirm v-if="!item.originModuleId" title="请确认是否删除模块？" @confirm="delModule(item,isModule=1)">
										<span class="el-icon-delete" title="删除模块" slot="reference"></span>
									</el-popconfirm>
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
			<el-drawer :visible.sync="grid.drawer" direction="btt" :modal="false" :wrapperClosable="false" size="200"
			 :before-close="handleClose">
				<div slot="title">
					<div slot="header" class="clearfix resource-search">
						<p>
							<span>资源</span>
							<el-autocomplete popper-class="my-autocomplete" v-model="searchResInput" :fetch-suggestions="querySearch"
							 placeholder="请输入内容" size="small" clearable>
								<template slot-scope="{ item }">
									<div class="name">{{ item.value}}</div>
								</template>
							</el-autocomplete>
							<el-button icon="el-icon-search" circle @click="searchRes" title="搜索" size="mini"></el-button>
						</p>
					</div>
				</div>
				<el-card class="box-card" shadow="never">
					<!-- <draggable class="resource-list div-column" v-model="arrResource" :sort="false" filter=".resource-type-title"
					 draggable=".resource-item" :group="{ name: 'resourceItem', pull: 'clone', put: false }" @start="dragStart" @end="dragEnd">
						<template v-for="(item,index) in arrResource">
							<div v-if="index==0 || item.type!=arrResource[index-1].type" class="resource-type-title">{{resourceType[item.type]}}</div>
							<div class="resource-item text-ellipsis" :key="'res'+ index" :data-id="item.id" :data-type="item.type" :title="item.name">
								{{item.name||""}}
							</div>
						</template>
					</draggable> -->
					<template v-for="(item,key) in objResource">
						<div class="resource-box">
							<div class="resource-type-title">{{resourceType[key]}}</div>
							<draggable class="resource-list div-column" v-model="objResource[key]" :key="'drag'+key" :sort="false" filter=".resource-type-title"
							 draggable=".resource-item" :group="{ name: 'resourceItem', pull: 'clone', put: false }" @start="dragStart" @end="dragEnd"
							 :style="'width:'+ 205 * Math.ceil((item.length)/4)+'px'">
								<div class="resource-item text-ellipsis" v-for="(resItem,index) in item" :key="'res'+ index" :data-id="resItem.id"
								 :data-type="resItem.type" :title="resItem.name">
									{{resItem.name||""}}
								</div>
							</draggable>
						</div>
					</template>
				</el-card>
			</el-drawer>
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
					drawer: false //抽屉显示
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
				// 资源列表数据-数组
				arrResource: [],
				// 资源列表数据-对象
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
			Toolbar: (resolve) => {
				require(["../../components/common/Toolbar.vue"], resolve)
			},
			//页面设置部分
			PageSetup: (resolve) => {
				require(["../../components/common/PageSetup.vue"], resolve)
			},
			//页头
			Header: (resolve) => {
				require(["../../components/resource/Header.vue"], resolve)
			},
			//页脚
			Footer: (resolve) => {
				require(["../../components/resource/Footer.vue"], resolve)
			},
			//轮播图
			carousel: (resolve) => {
				require(["../../components/resource/Carousel.vue"], resolve)
			},
			//列表
			list: (resolve) => {
				require(["../../components/resource/List.vue"], resolve)
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
			//关闭抽屉
			handleClose(done) {
				done();
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
			// 获取资源列表数据
			fetchResource() {
				this.axios
					.get("/portal/api/resources/role")
					.then((res) => {
						if (res.data) {
							let arrRes = []
							// 过滤掉没有数据的资源类型
							for (let key in res.data) {
								if (res.data[key] && res.data[key].length > 0) {
									arrRes = arrRes.concat(res.data[key])
								} else {
									delete res.data[key]
								}
							}
							//资源数据
							this.arrResource = arrRes
							this.objResource = res.data
							//手动释放内存
							arrRes = null
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
			/* 
				拖拽前事件
				@params:
					evt：{to,from,item,clone,oldIndex,newIndex}
					exchange:是否是模块交换资源
			 */
			dragStart(evt, exchange) {
				//若是资源交换则来源元素设置成目标元素
				if (!!exchange) {
					// evt.item = evt.to.children[2] //这个获取不一定能取到目标的Item
					//目标模块,资源元素拖进去后有多个，要排除掉当前拖拽的这个
					let elemToList = evt.to.getElementsByClassName("module-main")
					//若拖拽的资源和目标模块的资源是同一个时则不执行资源挂载方法
					if (elemToList && elemToList.length > 0) {
						for (let i = 0; i < elemToList.length; i++) {
							if (evt.item.getAttribute("data-id") != elemToList[i].getAttribute("data-id")) { //当前拖拽的资源Id != 目标模块的资源Id
								evt.item = elemToList[i]
							}
						}
					}
				}
				if (evt.item) {
					this.draggableElement.draggableElementType = evt.item.getAttribute("data-type")
					this.draggableElement.draggableResourceId = evt.item.getAttribute("data-id")
					this.draggableElement.draggableResourceName = evt.item.getAttribute("title")
				}
			},
			/* 
				拖拽后事件
				@params:
					evt：{to,from,item,clone,oldIndex,newIndex}
			 */
			dragEnd(evt) {
				let elemTo = evt.to //目标元素
				let elemFrom = evt.from //操作元素
				//不是当前模块拖拽到当前模块
				if (elemTo.id && elemFrom.id != elemTo.id) {
					let elemToItem = elemTo.getElementsByClassName("module-main") //目标模块 资源元素
					//若拖拽的资源和目标模块的资源是同一个时则不执行资源挂载方法
					if (elemToItem && elemToItem.length == 1) {
						let itemResId = evt.item.getAttribute("data-id") //当前拖拽的资源Id
						let toResId = elemToItem[0].getAttribute("data-id") //目标模块的资源Id
						if (itemResId == toResId) {
							return false
						}
					}
					//页面中的模块
					if (elemTo.className && elemTo.className.indexOf("module_style") != -1) {
						//给模块挂载资源
						this.moduleSetResource(elemTo)
					}
					//模块交换资源
					if (elemFrom.className) {
						//页面中带资源模块或者不带资源模块
						if (elemFrom.className.indexOf("module-show") != -1 || elemFrom.className.indexOf("module-edit") != -1) {
							//重置当前拖拽模块
							this.dragStart(evt, 1)
							//给模块挂载资源
							this.moduleSetResource(elemFrom)
						}
					}
				}
			},
			/* 
				模块设置资源
				@params:
					elemTo：目标元素
			*/
			moduleSetResource(elemTo) {
				let resourceId = this.draggableElement.draggableResourceId,
					resourceName = this.draggableElement.draggableResourceName,
					moduleId = elemTo.id
				//设置当前拖拽的模块Id
				this.draggableElement.draggableModuleId = moduleId
				//模块挂载资源,若没有resourceId则删除模块下的资源
				if (moduleId) {
					this.axios({
						method: "patch",
						url: "/portal/api/modules/resource/" + moduleId + "/" + resourceId,
					}).then((res) => {
						if (res.data) {
							this.$message({
								type: "success",
								message: "添加资源成功!",
							})
							if (elemTo.className.indexOf("module-show") > -1) { //显示模块,有资源
								for (var i = 0; i < this.showModuleArr.length; i++) {
									if (this.showModuleArr[i].id == moduleId) {
										let currModule = this.showModuleArr[i]
										//当前操作的资源
										this.arrResource.map((item, index) => {
											if (item.id == resourceId) {
												//给当前操作的模块挂载对应的资源
												currModule.draggableElement.draggableElementType = item.type
												currModule.draggableElement.draggableResourceId = item.id
												currModule.moduleName = item.name
												currModule.resourceVO = item
												this.showModuleArr[i] = currModule
											}
										})
									}
								}
								//模块名称
								res.data.moduleName = resourceName
								//修改模块名称
								this.handleSaveModuleName(res.data)
								setTimeout(() => {
									//获取右侧面板模块数据
									this.fetchModuleData(this.pageId, true)
								}, 200)
							} else if (elemTo.className.indexOf("module-edit") > -1) { //编辑模块
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
						}
					})
				}
			},
			//锁定模块不可操作提示
			moduleLockedTips(locked) {
				if (locked == "1") {
					this.$message({
						type: "warning",
						message: "锁定模块不可操作",
					})
					return true
				} else {
					return false
				}
			},
			// 删除模块
			delModule(item, isModule) {
				//当前操作的是模块
				if (isModule) {
					item.moduleId = item.id
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
						this.showModuleArr.map((list, index) => {
							if (list.id == item.moduleId) {
								this.showModuleArr.splice(index, 1)
							}
						})
						// 无资源
						if (!item.portalResourceId) {
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
			// 删除资源
			deleteResource(item) {
				// let isLocked = this.moduleLockedTips(item.isLocked) //锁定模块不可操作提示
				// if (!isLocked) {
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
						if (res.data) {
							let arrRes = []
							// 过滤掉没有数据的资源类型
							for (let key in res.data) {
								if (res.data[key] && res.data[key].length > 0) {
									arrRes = arrRes.concat(res.data[key])
								} else {
									delete res.data[key]
								}
							}
							//资源数据
							this.arrResource = arrRes
							this.objResource = res.data
							//手动释放内存
							arrRes = null
						}
					})
					.catch((error) => {
						console.log(error)
					})
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
		mounted: function() {
			//获取数据字典项
			this.fetchDict()
			//获取资源列表数据
			this.fetchResource()
			// 初始化页面
			if (this.editingPage) {
				this.initPage()
			}
		}
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

	.page-margin-bottom {
		margin-bottom: 300px;
	}

	/deep/ .el-header {
		color: $fontColor1;

		.toolbar {
			background-color: $bgColor2;
			border-bottom: 1px solid $bgColor2;

			.el-form-item:first-child {
				margin-left: 3px;
			}

			.el-form-item:not(:first-child) {
				margin-left: 15px;
			}

			.el-radio-button--small .el-radio-button__inner {
				padding: 5px 10px;
			}

			.el-input--small .el-input__inner {
				height: 24px;
				line-height: 24px;
			}

			.el-input-number--small {
				width: 120px;
				line-height: 22px;
			}
		}
	}

	/* 页头、页脚操作隐藏 */
	/deep/ .page-hf {
		display: none !important;
	}

	/* 抽屉 */
	/deep/ .el-drawer__wrapper {
		top: auto;
		height: 325px;
		width: 100%;
		-webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

		.el-drawer__container {
			:focus {
				outline: none;
			}

			.el-drawer {
				height: 100%;

				.el-drawer__header {
					margin-bottom: 0;
					padding: 10px 20px;
					background: $subColor3;
					border-radius: 8px 8px 0 0;
					color: $fontColor4;
				}

				.el-card__body {
					padding: 0px 20px;
					color: $fontColor1;

					.resource-box {
						display: inline-block;
						float: left;
						width: auto;
						margin-left: 20px;
					}

					.resource-type-title {
						line-height: 24px;
						padding: 8px 20px;
						margin-bottom: 10px;
						border-bottom: 2px solid $subColor3;
					}

					.resource-list {
						/* 对齐方向 */
						-webkit-flex-direction: column;
						-ms-flex-direction: column;
						flex-direction: column;
						/* 是否换行 */
						-webkit-flex-wrap: wrap;
						-ms-flex-wrap: wrap;
						flex-wrap: wrap;
						/* 水平对齐方式 */
						-webkit-justify-content: flex-start;
						justify-content: flex-start;
						-webkit-align-items: flex-start;
						align-items: flex-start;
						/* 整体向左靠 */
						-webkit-align-content: flex-start;
						align-content: flex-start;
						overflow: auto;

						>div {
							display: inline-block;
							float: left;
							width: 180px;
						}

						.resource-item {
							height: 32px;
							line-height: 32px;
							border-radius: 20px;
							margin: 10px 20px 10px 2px;
							padding: 0 5px;
							text-align: center;
							background-color: $bgColor2;
							box-shadow: 0px 0px 5px #999999;
						}

						.resource-item:hover {
							background-color: $subColor3;
							color: $fontColor4;
						}
					}
				}

			}
		}
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
		line-height: 20px;
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
		line-height: 20px;
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
