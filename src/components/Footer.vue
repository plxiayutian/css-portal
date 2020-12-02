<template>
	<div id="footer" class="footer">
		<div class="footer-wrap div-column">
			<div class="footer-left div-column">
				<ul>
					<li><a href="http://www.caac.gov.cn/website/old/H1/H2/" target="_blank">民航概括</a></li>
					<li><a href="">民航网络</a></li>
				</ul>
				<ul>
					<li><a href="http://www.caac.gov.cn/INDEX/GZLY/" target="_blank">联系我们</a></li>
					<li><a href="http://www.caac.gov.cn/WZDT/" target="_blank">网站地图</a></li>
					<li><a href="" target="_blank">友情链接</a></li>
					<li><a href="" target="_blank">温馨提示</a></li>
				</ul>
				<ul>
					<li>地址：北京市东城区东四西大街155号（100710）</li>
					<li>网站管理：中国民用航空局综合司</li>
					<li>ICP备案编号：京ICP备19046468号</li>
					<li>政府网站识别码：bm70000001</li>
				</ul>
			</div>
			<ul class="footer-right div-column">
				<li>
					<img src="../assets/images/code/EWM.png" alt="">
					<p>移动客户端</p>
				</li>
				<li>
					<img src="../assets/images/code/GWYXCX.jpg" alt="">
					<p>国务院小程序</p>
				</li>
				<!-- <li><img src="../assets/images/code/code3.png" alt=""><p>客服热线</p></li> -->
			</ul>
		</div>
	</div>
</template>
<script>
	export default {
		name: "pageFooter",
		data() {
			return {
				footerContent: "@Copyright 中国软件与技术服务股份有限公司",
			}
		},
	}
</script>
<style lang="scss" scoped>
	.footer {
		background: $bg-color2;
		// padding-bottom: 49px;
		padding-bottom: 37px;

		.footer-wrap {
			width: $page-width;
			margin: 0 auto;
			justify-content: space-between;

			.footer-left {
				float: left;
				margin-top: 23px;

				ul {
					margin-right: 70px;

					>li {
						color: $font-color2;
						line-height: 30px;

						a {
							color: $font-color2;
						}
					}
				}
			}

			.footer-right {
				float: right;
				margin-top: 29px;

				li {
					margin-right: 28px;
					position: relative;
					cursor: pointer;

					>img {
						display: inline-block;
						width: 84px;
						height: 84px;
					}
				}
			}
		}
	}
</style>
