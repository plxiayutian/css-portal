<template>
	<div class="module-main" :data-id="resourceInfo.id" :data-type="type">
		<el-card shadow="hover" class="box-card">
			<div slot="header" class="clearfix">
				<span class="resource_list_name_icon"><img src="../assets/images/list_icon.png" /></span>
				<span class="resource_list_name">{{ resourceInfo.name }}</span>
				<el-button class="resource_list_more_btn" type="text" @click="checkList"> >> </el-button>
			</div>
			<div class="list_item div-column" v-for="(item, index) in arrData" :key="'list'+index" @click="checkItem(item)">
				<div class="list_item_content text-ellipsis" v-for="(key,i) in item.disKey" :key="i" :style="{ width: key.width }"
				 :title="key.content || ''">
					<span>{{ key.content }}</span>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		props: ['moduleId', 'moduleData', 'type'],
		name: 'list',
		data() {
			return {
				//资源信息
				resourceInfo: {
					// columnNum: '4', // 2,4,6,12
					// contentList: [{
					// 		key: 'title',
					// 		beginCol: '1',
					// 		endCol: '3'
					// 	},
					// 	{
					// 		key: 'time',
					// 		beginCol: '4',
					// 		endCol: '4'
					// 	}
					// ],
					// detailAddr: "/platform/api/org/users",
					// id: "",
					// ip: "127.0.0.1",
					// listAddr: "",
					// name: "列表资源名称",
					// path: "/platform/api/org/users/allusers",
					// port: "8085",
					// terms: 3,
					// title: "列表资源标题"
				},
				//资源数据
				resourceData: [
					// {
					// 	title: '控件显示和隐藏有两种方法，两种方法分别利用HTML的style中的两',
					// 	time: '2020-01-02'
					// },
					// {
					// 	title: '天津对第138例本土新冠病毒全基因组测序。9日分析结果显示：与北美3至6月份流行毒株高度近似',
					// 	time: '2020-03-02'
					// },
					// {
					// 	title: '控件显示和隐藏有两种方法，两种方法分别利用HTML的style中的两',
					// 	time: '2020-01-02'
					// }
				],
				// 计算后的对象
				arrData: [
					// {
					// 	detailId:'',
					// 	disKey:{
					// 		key1: {
					// 			name: '',
					// 			content: '',
					// 			width: ''
					// 		},
					// 		key2: {
					// 			name: '',
					// 			content: '',
					// 			width: ''
					// 		}
					// 	}
					// },
				]
			}
		},
		mounted() {
			// 获取list资源数据
			this.getResourceArr()
		},
		methods: {
			// 获取list资源数据
			getResourceArr() {
				if (this.moduleData) { //传递数据渲染
					if (this.moduleData.resourceData) {
						this.resourceData = this.moduleData.resourceData.data
					}
					if (this.moduleData.resourceInfo) {
						this.resourceInfo = this.moduleData.resourceInfo
					}
					//设置展示数据
					this.getArrData()
				} else { //根据id获取
					this.axios.get('/portal/api/modules/vo/' + this.moduleId)
						.then((res) => {
							if (res.data) {
								this.resourceData = res.data.resourceVO.resourceData.data
								this.resourceInfo = res.data.resourceVO.resourceInfo
								//设置展示数据
								this.getArrData()
							}
						})
						.catch((error) => {
							console.log(error)
						})
				}
			},
			//设置展示数据
			getArrData() {
				if (this.resourceData.length > 0) {
					this.resourceData.map((item, index1) => {
						let obj = {}
						let objContant = {}
						//detailKey是后台返回keyName
						let detailKey = this.resourceInfo.detailKey
						this.resourceInfo.contentList.map((list, index2) => {
							let width = "auto"
							if (this.resourceInfo.columnNum) {
								width = (list['endColum'] - list['beginColum'] + 1) / this.resourceInfo.columnNum * 100 + '%'
							}
							obj['key' + index2] = {
								'name': list['keyName'],
								'content': item[list['keyName']],
								'width': width
							}
						})
						objContant.disKey = obj
						//获取每条数据的唯一id值，keyName为后台配置detailKey
						objContant.detailId = item[detailKey]
						this.arrData.push(objContant)
					})
				}
			},
			// 点击查看详情
			checkItem(item) {
				if (this.resourceInfo.ip && this.resourceInfo.detailAddr) {
					let url = 'http://' + this.resourceInfo.ip + ':' + this.resourceInfo.port + this.resourceInfo.detailAddr + "/" + (
						item.detailId || "")
					window.open(url, '_blank')
				}
			},
			// 更多列表
			checkList() {
				let url = 'http://' + this.resourceInfo.ip + ':' + this.resourceInfo.port + this.resourceInfo.listAddr;
				window.open(url, '_blank')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box-card {
		border: none;
	}

	.el-card {
		/deep/ .el-card__header {
			border: none;
			height: 40px;
		}

		/deep/ .el-card__body {
			padding-top: 0;
			padding-bottom: 0;
		}

		.resource_list_name_icon {
			margin-right: 10px;
		}

		.resource_list_name {
			font-weight: bold;
		}

		.resource_list_more_btn {
			float: right;
			padding: 3px 0;
		}

		.list_item {
			flex-wrap: nowrap;
			line-height: 44px;
			cursor: pointer;
			box-shadow: inset 0 -1px 0 0 $border-color;
			color: $font-color;

			.list_item_content {
				float: left;
			}

			div.list_item_content:last-child {
				color: $font-color3;
				text-align: right;
			}

			div.list_item_content:only-child {
				color: $font-color;
				text-align: left;
			}
		}

		.list_item:hover {
			@include changeFirstColor($first-color); //hover字体颜色

			div.list_item_content:last-child {
				@include changeFirstColor($first-color); //hover字体颜色
			}
		}

		.list_item::after {
			content: '';
			display: block;
			clear: both;
		}
	}

	.el-card.box-card.is-hover-shadow:hover {
		box-shadow: none;
	}
</style>
