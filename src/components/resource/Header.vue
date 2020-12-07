<template>
	<div id="header" class="header">
		<div class="h-top div-column">
			<div class="h-top-left">
				<img class="h-logo" src="../../assets/images/logo.png" :alt="imgAlt">
			</div>
			<div class="h-top-right div-column">
				<ul class="top-right-wrap div-column">
					<li><a href="https://mail.caac.gov.cn/">政府邮箱</a></li>
					<li><a href="http://www.caac.gov.cn/INDEX/GZPT/">工作平台入口</a></li>
					<li><a href="">人才招聘</a></li>
				</ul>
				<p class="h-loginer">
					<span class="iconfont iconren"></span> {{registrar}}, 您好
				</p>
				<p class="h-btn">
					<router-link :to="isAdmin?'/adminEdit':'/indexEdit'"><span class="iconfont iconshezhi" title="设置"></span></router-link>
					<a href="/platform/loginOut"><span class="iconfont iconbangong-tuichu" title="退出"></span></a>
				</p>
			</div>
		</div>
		<el-menu :default-active="activeIndex" class="menu-wrap" mode="horizontal">
			<el-menu-item index="1">
				<router-link to="/index">首页</router-link>
			</el-menu-item>
			<el-menu-item index="2"><a href="http://www.caac.gov.cn/XWZX/" target="_blank">新闻中心</a></el-menu-item>
			<el-menu-item index="3"><a href="http://www.caac.gov.cn/XXGK/XXGK/" target="_blank">信息公开</a></el-menu-item>
			<el-menu-item index="4"><a href="http://www.caac.gov.cn/FWDT/" target="_blank">办事大厅</a></el-menu-item>
			<el-menu-item index="5"><a href="http://www.caac.gov.cn/HDJL/" target="_blank">互动交流</a></el-menu-item>
			<el-menu-item index="6"><a href="http://www.caac.gov.cn/ZTZL/" target="_blank">专题专栏</a></el-menu-item>
			<el-menu-item index="7"><a href="http://www.caac.gov.cn/GYMH/" target="_blank">关于民航</a></el-menu-item>
			<el-menu-item index="8"><a href="http://www.caac.gov.cn/WHMH/" target="_blank">我和民航</a></el-menu-item>
		</el-menu>
	</div>

</template>
<script>
	export default {
		name: "pageHeader",
		data() {
			return {
				imgSrc: "../../assets/images/logo.png",
				imgAlt: "中国软件",
				registrar: "测试用户",
				activeIndex: "1",
				//是否是管理员
				isAdmin: false,
			}
		},
		methods: {
			//是否是管理员
			isSuperadmin() {
				this.axios({
						method: 'get',
						url: '/platform/api/org/users/{userId}/superadmin',
					})
					.then((res) => {
						if (res.data) {
							this.isAdmin = true //是管理员
						} else {
							this.isAdmin = false
						}
					})
					.catch((error) => {
						console.log(error)
					})
			}
		},
		mounted: function() {
			//是否是管理员
			// this.isSuperadmin()
		}
	}
</script>
<style lang="scss" scoped>
	//页头系统名称、设置栏高度
	$heaer-top-height: 50px;
	//导航栏高度
	$heaer-menu-height: 50px;

	.header {
		color: $font-color1;
		transition: 0.3s linear;
		@include changeBackgroundColor($main-color); //背景色

		.h-top {
			width: $page-width;
			margin: 0 auto;
			position: relative;
			overflow: hidden;
			height: $heaer-top-height;
			line-height: $heaer-top-height;
			justify-content: space-between;

			.h-top-left {
				.h-logo {
					vertical-align: middle;
				}
			}

			.h-top-right {
				font-size: 12px;

				a,
				a:hover {
					color: inherit;
				}

				.top-right-wrap a {
					margin-right: 20px;
				}

				.h-loginer {
					display: inline-block;
					float: right;
					margin-right: 10px;
					cursor: pointer;
				}

				.iconfont {
					font-size: 20px;
				}

				.h-btn span {
					margin-left: 10px;
				}
			}
		}

		.menu-wrap {
			width: $page-width;
			margin: 0 auto;
			border: none;
			@include changeBackgroundColor($main-color); //背景色
			border-bottom: none;

			.el-menu-item {
				height: $heaer-menu-height;
				line-height: $heaer-menu-height;
				font-size: $font-size-main;
				border: none;
				color: $font-color1;
				@include changeMenuBgImage($first-color, $main-color); //背景图
				background-size: 100% 200%;
				transition: background-position 0.2s linear;
			}

			.is-active {
				// @include changeMenuBgImage($first-color,$main-color); //背景图
				background-position: 0% 100%;
				background-size: 100% 100%;
			}
		}
	}

	/* 菜单栏目渐变滤镜 */
	:root .header .menu-wrap .el-menu-item {
		filter: none;
	}

	.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
		color: $font-color1;
		// @include changeMenuBgImage($main-color, $first-color); //背景图
		background-position: 0% 100%;
		border: none;
	}

	.el-menu--horizontal>.el-menu-item.is-active {
		color: $font-color1;
		// @include changeMenuBgImage($main-color, $first-color); //背景图
		background-position: 0% 100%;
		border-bottom: 4px solid $bg-color;
	}

	.el-menu--horizontal>.el-menu-item:not(.is-active) {
		@include opacity(80); //透明度
	}

	.el-menu--horizontal>.el-menu-item[data-v-61dd7a3d]:not(.is-disabled):hover,
	.el-menu--horizontal>.el-menu-item[data-v-61dd7a3d]:not(.is-disabled):focus {
		background-color: transparent;
	}
</style>
