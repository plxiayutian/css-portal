<template>
	<div class="module-main" :data-id="resourceInfo.id" :data-type="type">
		<el-carousel height="100%" :autoplay="false">
			<el-carousel-item v-for="item in resourceData" :key="item.id">
				<a :href="item.url" target="_blank">
					<!-- 1填充 -->
					<img v-if="resourceInfo.fillType == '1'" :src="item.src" style="height: 100%;" />
					<!-- 2适应 -->
					<img v-if="resourceInfo.fillType == '2'" :src="item.src" style="width: 100%;" />
					<!-- 3拉伸 -->
					<img v-if="resourceInfo.fillType == '3'" :src="item.src" style="width: 100%;height: 100%;" />
				</a>
				<div class="carousel_title">
					<span>{{ item.title }}</span>
				</div>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
	export default {
		props: ['moduleId', 'moduleData', 'type'],
		name: "carousel",
		data() {
			return {
				//轮播图数据
				resourceData: [],
				//轮播图信息
				resourceInfo: {
					// createUser: "",
					// fillType: "1",  // 1填充  2适应  3拉伸
					// forwardUrlKey: "/forwardUrlKey",
					// getPicturePathKey: "/getPicturePathKey",
					// id: "8",
					// ip: "127.0.0.1",
					// name: "轮播图1",
					// path: "/portal/carouseledit",
					// picIdKey: "1",
					// picTitleKey: "测试专用",
					// port: "8082",
					// carouseName: "cstuo",
					// title: "测试专用--tuo"
				}
			}
		},
		mounted() {
			// 获取资源数据
			this.getResourceArr()
		},
		methods: {
			// 获取资源数据
			getResourceArr() {
				if (this.moduleData) { //传递数据渲染
					if (this.moduleData.resourceData) {
						//根据数据的attachId取图片路径
						this.getImageSrc(this.moduleData.resourceData.data)
					}
					if (this.moduleData.resourceInfo) {
						this.resourceInfo = this.moduleData.resourceInfo
					}
				} else { //根据id获取
					this.axios.get('/portal/api/modules/vo/' + this.moduleId)
						.then((res) => {
							if (res.data) {
								//资源信息
								if (res.data.resourceVO && res.data.resourceVO.resourceInfo) {
									this.resourceInfo = res.data.resourceVO.resourceInfo
								}
								//资源数据
								if (res.data.resourceVO && res.data.resourceVO.resourceData) {
									let resData = res.data.resourceVO.resourceData;
									if (resData && resData.data.length > 0) {
										//根据数据的attachId取图片路径
										this.getImageSrc(resData.data)
									}
									//手动释放内存
									resData = null
								}
							}
						})
						.catch((error) => {
							console.log(error)
						})
				}
			},
			//根据数据的attachId取图片路径
			getImageSrc(data) {
				if (data && data.length > 0) {
					// 按sort字段排序
					data.sort((a, b) => {
						return a.sort > b.sort ? 1 : -1
					})
					data.map((item, index) => {
						item['src'] = '/platform/UploadChunkController/img?attachId=' + item.attachId
						this.resourceData.push(item)
					})
				}
			},
			// 更多列表
			checkList() {
				var url = 'http://' + this.resourceInfo.ip + ':' + this.resourceInfo.port + this.resourceInfo.listAddr;
				window.open(url, '_blank');
			}
		}
	};
</script>

<style scoped>
	/* 第一种轮播图的样式 */
	.el-carousel--horizontal {
		height: 100%;
	}

	.el-carousel__item h3 {
		color: #475669;
		font-size: 18px;
		opacity: 0.75;
		line-height: 300px;
		margin: 0;
	}

	.carousel_title {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		text-align: left;
		font-size: 16px;
		color: #fff;
		padding: 10px 0;
		background-color: rgba(12, 10, 34, 0.6);
	}

	.carousel_title span {
		display: block;
		margin-left: 15px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 60%;
	}

	/* 底部指示器的样式 */
	.el-carousel--horizontal /deep/ .el-carousel__indicators {
		right: 0;
		left: auto;
	}

	.el-carousel--horizontal /deep/ .el-carousel__button {
		width: 8px;
		height: 4px;
		border-radius: 2px;
	}

	.el-carousel--horizontal /deep/ .el-carousel__indicator.is-active button {
		width: 24px;
	}
</style>
