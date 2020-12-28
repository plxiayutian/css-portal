// 页面展示端路由
// require.ensure 是 Webpack 的特殊语法，用来设置 code-split point

// 展示页面
const Index = resolve => {
	require.ensure(['../views/portal/index.vue'], () => {
		resolve(require('../views/portal/index.vue'))
	})
}
// 普通用户编辑页面
const IndexEdit = resolve => {
	require.ensure(['../views/portal/indexEdit.vue'], () => {
		resolve(require('../views/portal/indexEdit.vue'))
	})
}
// 管理员编辑页面
const AdminEdit = resolve => {
	require.ensure(['../views/portal/adminEdit.vue'], () => {
		resolve(require('../views/portal/adminEdit.vue'))
	})
}
// 错误页面
const ErrPage = resolve => {
	require.ensure(['../views/portal/errPage.vue'], () => {
		resolve(require('../views/portal/errPage.vue'))
	})
}
// 全文检索页面
const Search = resolve => {
	require.ensure(['../views/portal/search.vue'], () => {
		resolve(require('../views/portal/search.vue'))
	})
}
export default [{
		path: '/',
		redirect: '/index',
		component: Index
	},
	{
		path: '/index',
		name: 'index',
		component: Index
	},
	{
		path: '/indexEdit',
		name: 'indexEdit',
		component: IndexEdit
	},
	{
		path: '/adminEdit',
		name: 'adminEdit',
		component: AdminEdit
	},
	{
		path: '/errPage',
		name: 'errPage',
		component: ErrPage
	},
	{
		path: '/search',
		name: 'search',
		component: Search
	}
	// {
	// 	path: '*',
	// 	component: Index
	// 	// ES7的懒加载，webpack2官网推荐使用,需要配合babel的syntax-dynamic- 
	// 	// component: () => import('../pages/index/index.vue')
	// }
]
