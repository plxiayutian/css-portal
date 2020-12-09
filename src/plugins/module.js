/**
 * 模块相关的属性和方法
 * create by penglei
 * 2020.12.7
 * */
//引入vue
import Vue from 'vue'
//引入vuex
import store from '../store/store.js'
//引入vue路由
import router from '../router/router.js'
// 引入axios和VueAxiosss
import axios from './request.js'
// 引入element-ui的方法
import {
	Loading,
	MessageBox,
	Message,
	Notification
} from 'element-ui'
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;
let objVue = new Vue()

let objModule = {
	/*
		获取模块数据
		@params:
			pageId：页面Id
			callback：回调函数
	*/
	fetchModuleData(pageId, callback) {
		return new Promise(function(resolve, reject) {
			axios.get("/portal/api/modules/" + pageId + "/module/resource")
				.then((res) => {
					if (res.data) {
						//回调函数
						if (callback) {
							callback(res.data)
						} else {
							resolve(res.data)
						}
					}
				})
				.catch((error) => {
					console.log(error)
				})
		})
	},
	/*
		拖拽创建模块
		@params:
			module：模块信息
			pageId：页面Id
			arrModuleAdd：新创建模块
			arrModuleEdit：编辑模块
			callback：回调函数
	*/
	crateModule(module, pageId, arrModuleAdd, arrModuleEdit, callback) {
		return new Promise(function(resolve, reject) {
			//保存
			if (module) {
				module.portalPageId = pageId //模块关联页面id
				module.showModuleName = true //显示模块名称
				axios.post("/portal/api/modules", module)
					.then((res) => {
						if (res.data) {
							objVue.$message({
								type: "success",
								message: "模块保存成功!",
							})
							//根据id匹配当前操作模块
							arrModuleAdd.map((itemModule, index) => {
								if (itemModule.id == module.id) {
									//添加到待编辑模块数据中
									itemModule.id = res.data.id
									arrModuleEdit.push(itemModule)
									//删除待添加模块中的数据
									arrModuleAdd.splice(index, 1)
								}
							})
							if (callback) {
								callback(res.data)
							} else {
								resolve(res.data)
							}
						}
					})
			}
		})
	},
	/*
		修改模块名称
		@params:
			module：模块信息
			arrModuleShow：显示模块数据
			arrModuleEdit：编辑模块数据
	*/
	changeModuleName(module, arrModuleShow, arrModuleEdit) {
		return new Promise(function(resolve, reject) {
			if (module.moduleId) {
				axios({
						method: "put",
						url: "/portal/api/modules/modulename/",
						data: {
							moduleId: module.moduleId,
							moduleName: module.moduleName,
						}
					})
					.then((res) => {
						if (res.data) {
							let moduleArr,
								selectedModuleId = module.moduleId,
								changeModuleName = res.data.moduleName
							// 判断有无资源
							if (module.portalResourceId) {
								moduleArr = arrModuleShow
							} else {
								moduleArr = arrModuleEdit
							}
							//改变页面上对应模块的模块名称
							moduleArr.map((list, index) => {
								if (list.id == selectedModuleId) {
									list.moduleName = changeModuleName
								}
							})
							//回调方法
							resolve(res.data)
						}
						// else {
						// 	objVue.$message({
						// 		type: "error",
						// 		message: "模块名称修改失败！",
						// 	})
						// }
					})
					.catch((error) => {
						console.log(error)
					})
			}
		})
	},
	/*
	  切换模块锁定状态
	  @params:
		module:当前操作模块项
		index：当前操作模块索引
		none:是否是空模块
		callback:回调函数
	 */
	changeModuleLock(module, index, none, callback) {
		return new Promise(function(resolve, reject) {
			let strTitle = "" //提示信息
			let isLocked = 0 //模块是否锁定
			if (module.isLocked == '1') {
				strTitle = "请确认是否解除该模块锁定？"
				isLocked = '0' //锁定状态，0（未锁定）、1（锁定）
			} else {
				strTitle = "请确认是否锁定该模块？"
				isLocked = '1' //锁定状态，0（未锁定）、1（锁定）
			}
			objVue.$confirm(strTitle, "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
				.then(() => {
					axios({
						method: "patch",
						url: "/portal/api/modules/" + module.id + "/" + isLocked,
					}).then((res) => {
						if (res.data) {
							//修改当前模块的锁定图标
							module.isLocked = isLocked
							// if (!none) {
							// 	this.$set(this.showModuleArr[index], index, module)
							// } else { //空模块
							// 	this.$set(this.editModuleArr[index], index, module)
							// }
							objVue.$message({
								type: "success",
								message: isLocked == '1' ? "锁定成功!" : "解锁成功!"
							})
							//回调函数
							if (callback) {
								callback(res.data)
							} else {
								resolve(res.data)
							}
						}
					})
				})
				.catch((cancel) => {
					// console.log("取消操作!")
				})
		})
	},
	/*
		模块设置资源
		@params:
			elemTo：目标元素
			param{
				arrModuleShow：显示模块数据
				arrModuleEdit：编辑模块数据
				objDrag：拖拽对象信息
				arrResource:所有资源数据
			}
			callback：回调函数
	*/
	moduleSetResource(elemTo, param, callback) {
		return new Promise(function(resolve, reject) {
			let resourceId = param.objDrag.draggableResourceId,
				resourceName = param.objDrag.draggableResourceName,
				moduleId = elemTo.id
			//设置当前拖拽的模块Id
			param.objDrag.draggableModuleId = moduleId
			//模块挂载资源,若没有resourceId则删除模块下的资源
			if (moduleId) {
				axios({
					method: "patch",
					url: "/portal/api/modules/resource/" + moduleId + "/" + resourceId,
				}).then((res) => {
					if (res.data) {
						objVue.$message({
							type: "success",
							message: "添加资源成功!",
						})
						if (elemTo.className.indexOf("module-show") > -1) { //显示模块,有资源
							for (var i = 0; i < param.arrModuleShow.length; i++) {
								if (param.arrModuleShow[i].id == moduleId) {
									let currModule = param.arrModuleShow[i]
									//当前操作的资源
									param.arrResource.map((item, index) => {
										if (item.id == resourceId) {
											//给当前操作的模块挂载对应的资源
											currModule.draggableElement.draggableElementType = item.type
											currModule.draggableElement.draggableResourceId = item.id
											currModule.moduleName = item.name
											currModule.resourceVO = item
											param.arrModuleShow[i] = currModule
										}
									})
								}
							}
							//模块名称
							res.data.moduleName = resourceName
							//回调函数
							if (callback) {
								callback(res.data, true) //拖拽到有资源模块
							} else {
								resolve(res.data, true) //拖拽到有资源模块
							}
						} else if (elemTo.className.indexOf("module-edit") > -1) { //编辑模块
							for (var i = 0; i < param.arrModuleEdit.length; i++) {
								if (param.arrModuleEdit[i].id == moduleId) {
									//当前操作模块添加到展示数据中
									param.arrModuleEdit[i]["draggableElement"] = param.objDrag
									//模块名称
									param.arrModuleEdit[i].moduleName = resourceName
									param.arrModuleShow.push(param.arrModuleEdit[i])
									//删除当前正在操作编辑的模块数据
									param.arrModuleEdit.splice(i, 1)
								}
							}
							//模块名称
							res.data.moduleName = resourceName
							//回调函数
							if (callback) {
								callback(res.data, false) //拖拽到无资源模块
							} else {
								resolve(res.data, false) //拖拽到无资源模块
							}
						}
					}
				})
			}
		})
	},
	/*
		删除模块
		@params:
			module：模块信息
			arrModuleShow：显示模块数据
			arrModuleEdit：编辑模块数据
			isModule：当前操作的是否是模块
			callback：回调函数
	*/
	delModule(module, arrModuleShow, arrModuleEdit, isModule, callback) {
		return new Promise(function(resolve, reject) {
			//当前操作的是模块
			if (isModule) {
				module.moduleId = module.id
			}
			axios({
				method: "delete",
				url: "/portal/api/modules/" + module.moduleId,
			}).then((res) => {
				if (res.data) {
					objVue.$message({
						type: "success",
						message: "删除模块成功！",
					})
					if (arrModuleShow.length > 0) {
						// 页面上删除模块
						arrModuleShow.map((list, index) => {
							if (list.id == module.moduleId) {
								arrModuleShow.splice(index, 1)
							}
						})
					}
					// 无资源
					if (!module.portalResourceId) {
						arrModuleEdit.map((list, index) => {
							if (list.id == module.moduleId) {
								arrModuleEdit.splice(index, 1)
							}
						})
					}
					//回调函数
					if (callback) {
						callback(res.data)
					} else {
						resolve(res.data)
					}
				} else {
					objVue.$message({
						type: "error",
						message: "删除模块失败！",
					})
				}
			})
		})
	},
	/*
		删除模块下挂载的资源
		@params:
			moduleId:模块Id
			arrModuleShow：显示模块数据
			arrModuleEdit：编辑模块数据
			callback：回调函数
	*/
	delResource(moduleId, arrModuleShow, arrModuleEdit, callback) {
		return new Promise(function(resolve, reject) {
			axios({
				method: "delete",
				url: "/portal/api/modules/module/resource/" + moduleId,
			}).then((res) => {
				if (res.data) {
					objVue.$message({
						type: "success",
						message: "删除资源成功！",
					})
					// 页面上删除模块上资源
					arrModuleShow.map((item, index) => {
						if (item.id == moduleId) {
							arrModuleEdit.push(arrModuleShow[index])
							arrModuleShow.splice(index, 1)
						}
					})
					//回调函数
					if (callback) {
						callback(res.data)
					} else {
						resolve(res.data)
					}
				} else {
					objVue.$message({
						type: "error",
						message: "删除资源失败！",
					})
				}
			})
		})
	},
}
export default objModule
