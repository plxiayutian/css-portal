import Vue from 'vue';
//引入axios
import axios from 'axios';
//引入element消息提示工具
import {
	MessageBox,
	Message
} from 'element-ui'
//引入状态管理
import store from '@/store/store'
//引入路由
import router from '@/router/router'
//引入Token设置
import {
	getToken
} from '@/plugins/auth'

//创建axios实例
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
	// withCredentials: true, //跨域请求时发送Cookie
	timeout: 5000 //请求超时间
})

// 请求拦截器
service.interceptors.request.use(
	config => {
		// 在发送请求之前做些什么
		if (store.getters.token) {
			// 让每个请求携带 token
			// ['X-Token'] is a custom headers key
			// 请根据实际情况修改
			config.headers['X-Token'] = getToken()
		}
		return config
	},
	error => {
		// 处理请求错误
		console.log(error)
		return Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	/**
	 * 如果您想获取http信息，如头或状态请返回: response => response
	 * 通过自定义代码确定请求状态，还可以通过HTTP状态代码来判断状态
	 */
	response => {
		const res = response.data
		//判断是否登录
		var isLogin = response.headers["content-type"].indexOf("text/html")
		if(isLogin != -1){
			window.location.href = "/login"
			// if(!store.state.loginState){
			// 	store.commit('setLoginState',true)
			// 	window.open('/login')
			// 	return
			// }
		}else{
			// store.commit('setLoginState',false)
		}
		//如果自定义代码不是200，则判断为错误。
		if (res.code !== 200) {
			Message({
				message: res.message || 'Error',
				type: 'error',
				duration: 5 * 1000
			})
			// 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
			if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
				// to re-login
				MessageBox.confirm('您已注销，您可以取消停留在该页上，或重新登录', '确认注销', {
					confirmButtonText: '重新登录',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					store.dispatch('user/resetToken').then(() => {
						location.reload()
					})
				})
			}
			return Promise.reject(new Error(res.message || 'Error'))
		} else {
			return res
		}
	},
	error => {
		// if(error){
		// 	router.push('/errPage?status='+error.response.status).catch(err => { console.log(err) })
		// }
		console.log('err' + error) // for debug
		// Message({
		// 	message: error.message,
		// 	type: 'error',
		// 	duration: 5 * 1000
		// })
		return Promise.reject(error)
	}
)

//导出直接使用
export default service
