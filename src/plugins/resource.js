/**
 * 资源相关的属性和方法
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

let objResource = {
	/*
		获取资源列表数据
		@params:
			arrRes：所有资源数据
			objRes：按类型分类资源数据
	*/
	fetchResource(arrRes, objRes) {
		return new Promise(function(resolve, reject) {
			axios.get("/portal/api/resources/role")
				.then((res) => {
					//整理资源列表数据
					resolve(objResource.setResourceData(res.data, arrRes, objRes))
				})
				.catch((error) => {
					console.log(error)
				})
		})
	},
	/*
		搜索资源
		@params:
			searchResInput:搜索条件,输入框内容
			arrRes：所有资源数据
			objRes：按类型分类资源数据
	*/
	searchResource(searchResInput, arrRes, objRes) {
		return new Promise(function(resolve, reject) {
			axios.get("/portal/api/resources/bynameortype/", {
					params: {
						condition: searchResInput,
					},
				})
				.then((res) => {
					//整理资源列表数据
					resolve(objResource.setResourceData(res.data, arrRes, objRes))
				})
				.catch((error) => {
					console.log(error)
				})
		})
	},
	/*
		整理资源列表数据
		@params:
			data:资源数据
			arrRes：所有资源数据--array
			objRes：按类型分类资源数据--object
	*/
	setResourceData(data, arrRes, objRes) {
		if (data) {
			let arrResource = []
			// 过滤掉没有数据的资源类型
			for (let key in data) {
				if (data[key] && data[key].length > 0) {
					arrResource = arrResource.concat(data[key])
				} else {
					delete data[key]
				}
			}
			//资源数据
			if (arrRes) {
				arrRes = arrResource
			}
			if (objRes) {
				objRes = data
			}
			//手动释放内存
			arrResource = null
		}
		return {
			arrRes: arrRes,
			objRes: objRes
		}
	},
	/*
		根据输入内容过滤搜索下拉框提示内容
		@params:
			query:搜索条件
			resType:资源类型
	*/
	setQuerySearch(query, resType) {
		let results = []
		if (resType) {
			if (query) {
				for (let key in resType) {
					let tValue = resType[key]
					if (tValue.toLowerCase().indexOf(query.toLowerCase()) > -1) {
						results.push({
							value: tValue
						})
					}
				}
			} else {
				for (let key in resType) {
					results.push({
						value: resType[key]
					})
				}
			}
		}
		return results
	}
}
export default objResource
