import Vue from 'vue'
import App from './index.vue'
//引入vuex
import store from '../../store/store.js'
//引入vue路由
import router from '../../router/router.js'
//引入公用样式
import '../../assets/css/main.css'
//引入公用sass样式
// import '../../assets/variables/index.scss'
//引入less、scss样式及变量
import variables from '../../assets/variables/indexEdit.js'
Vue.prototype.variables = variables
// 引入字体图标
import '../../assets/css/icon/iconfont.css'

// 引入element-ui
import '../../plugins/element.js'
// 引入axios和VueAxiosss
import axios from '../../plugins/request.js'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// 引入babel-polyfill
// import 'babel-polyfill'
//vue-cli4方式引用babel-polyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'
// 支持使用ES6 promise对象
import Es6Promise from 'es6-promise'
// 用于在node或浏览器中支持ES6 与CommonJS
require('es6-promise').polyfill()
Es6Promise.polyfill()

//引入jquery
import $ from 'jquery'
// 全局引入echarts
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts
// 引入公用方法
import utils from '../../plugins/utils.js'
Vue.prototype.$utils = utils

Vue.config.productionTip = false

new Vue({
	router,
	// 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
	store,
	render: h => h(App),
}).$mount('#app')
