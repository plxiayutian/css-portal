<template>
	<div id="search" class="search">
		<el-form class="search-form" ref="form" :model="formData" label-width="80px">
			<div class="search-form-main">
				<div class="search-form-item div-column">
					<el-cascader class="search-cascader" v-model="formData.searchClass" :options="formData.arrClass" :props="{ expandTrigger: 'hover' }"
					 @change="handleChange"></el-cascader>
					<el-input placeholder="请输入内容" v-model="formData.content" class="search-input" @keyup="doSearch">
						<el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
					</el-input>
					<el-link class="change-search-tool" :underline="false" @click="changeSearchTool">
						<template v-if="showSearchTool">
							<span class="el-icon-caret-top"></span> 收起工具
						</template>
						<template v-if="!showSearchTool">
							<span class="el-icon-caret-bottom"></span> 搜索工具
						</template>
					</el-link>
				</div>
				<div v-if="showSearchTool" class="search-form-item div-column">
					<el-radio-group class="search-radio-group" v-model="formData.searchType">
						<el-radio label="all">全文检索</el-radio>
						<el-radio label="title">标题检索</el-radio>
					</el-radio-group>
					<el-date-picker class="search-date" v-model="formData.endDate" type="daterange" align="right" unlink-panels
					 range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="formData.pickerOptions">
					</el-date-picker>
				</div>
			</div>
			<div class="search-form-item div-column">
				<div class="search-result">{{objSearchData.resultText}}</div>
				<div class="search-sort div-column">
					<span class="search-sort-title">排列顺序：</span>
					<el-link class="search-sort-item" :underline="false" @click="changeSortByRelevance">相关程度</el-link>
					<el-link class="search-sort-item" :underline="false" @click="changeSortByTime">发布时间</el-link>
					<el-radio-group class="search-sort-type" v-model="formData.searchSort" @change="changeSortType">
						<el-radio label="sec">正序</el-radio>
						<el-radio label="des">反序</el-radio>
					</el-radio-group>
				</div>
			</div>
		</el-form>
		<div class="search-content div-column">
			<div class="search-list">
				<div class="doc-search-list">
					<div class="search-list-title">相关公文</div>
					<ul class="search-list-content">
						<template v-for="(item,index) in objSearchData.arrDoc">
							<li class="search-item">
								<a class="div-column" :href="item.href" target="_blank" :key="index">
									<div class="search-item-title text-ellipsis" v-html="item.title">{{ item.title||''}}</div>
									<div v-if="item.date" class="search-item-date">{{ new Date(item.date).Format("yyyy.MM.dd") }}</div>
									<div v-else class="search-item-date"></div>
								</a>
							</li>
						</template>
					</ul>
				</div>
				<el-divider></el-divider>
				<div class="info-search-list">
					<div class="search-list-title">相关信息</div>
					<ul class="search-list-content">
						<template v-for="(item,index) in objSearchData.arrInfo">
							<li class="search-item">
								<a :href="item.href" target="_blank" :key="index">
									<div class="search-item-title text-ellipsis" v-html="item.title">{{ item.title||'' }}</div>
									<div class="search-item-content text-ellipsis-3" v-html="item.content">
										<span>{{ item.date ? new Date(item.date).Format("yyyy.MM.dd")+ "，" :"" }}</span>{{ item.content||'' }}
									</div>
									<a class="search-important-news" href="http://www.baidu.com" target="_blank">局内要闻</a>
								</a>
							</li>
						</template>
					</ul>
				</div>
				<el-divider></el-divider>
				<div class="video-search-list">
					<div class="search-list-title">相关视频</div>
					<ul class="search-list-content">
						<template v-for="(item,index) in objSearchData.arrVideo">
							<li class="search-item search-item-video">
								<a :href="item.href" target="_blank" :key="index">
									<div class="search-video-img">
										<img id="u189_img" class="img " src="../../assets/images/search/u189.png">
									</div>
									<div class="search-item-title text-ellipsis" v-html="item.title">{{ item.title||'' }}</div>
								</a>
							</li>
						</template>
					</ul>
				</div>
			</div>
			<ul class="search-shortcut-time">
				<li v-for="(item,index) in arrShortcut" :class="shortcutActive==item.value ? 'active' : '' " :key="index" @click="setShortcut(item)"><span
					 class="el-icon-arrow-right"></span>
					{{ item.title|| "" }}</li>
			</ul>
		</div>
		<!-- 分页 -->
		<el-pagination class="pagination" background layout="prev, pager, next" :total="1000"></el-pagination>
	</div>
</template>
<script>
	export default {
		name: "search",
		data() {
			return {
				//搜索条件
				formData: {
					//当前选择的搜索分类
					searchClass: 'all',
					//搜索分类
					arrClass: [{
						value: 'all',
						label: '全部'
					}, {
						value: 'doc',
						label: '公文搜索',
						children: [{
							value: 'all',
							label: '全部'
						}, {
							value: '11',
							label: '公文'
						}, {
							value: '12',
							label: '电报'
						}, {
							value: '13',
							label: '呈批件'
						}]
					}, {
						value: 'menu',
						label: '栏目搜索',
						children: [{
							value: 'all',
							label: '全部'
						}, {
							value: '21',
							label: '民航局要闻'
						}, {
							value: '22',
							label: '民航局新闻'
						}, {
							value: '23',
							label: '互联网摘要'
						}]
					}, {
						value: 'video',
						label: '视频搜索'
					}],
					searchType: "all", //all：全文检索、title：标题检索
					content: "", //搜索条件
					//时间控件快捷选项
					pickerOptions: {
						shortcuts: [{
							text: '最近一周',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit('pick', [start, end]);
							}
						}, {
							text: '最近一个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
								picker.$emit('pick', [start, end]);
							}
						}, {
							text: '最近三个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
								picker.$emit('pick', [start, end]);
							}
						}]
					},
					startDate: '', //开始时间
					endDate: '', //结束时间
					searchSort: "des", //排序方式
				},
				objSearchData: { //查询结果数据
					resultText: "为你找到21003条相关结果。",
					arrDoc: [{
						title: `<span style="color:red;">民航局</span> 关于简化购买国内飞机票手续问题的请示的通知`,
						content: "",
						type: "doc",
						date: '2020-12-03',
						href: "https://element.eleme.io"
					}, {
						title: `关于中国<span style="color:red;">民航局</span> 对中国海洋直升飞机专业公司实行行政管理的若干问题的通知`,
						content: "",
						type: "doc",
						date: '2020-12-03',
						href: "https://element.eleme.io"
					}, {
						title: `中国<span style="color:red;">民航局</span>、公安部关于民航机场安全检查和消防工作由公安机关移交民航部门管理实施方案请示的通知`,
						content: "",
						type: "doc",
						date: '2020-12-03',
						href: "https://element.eleme.io"
					}],
					arrInfo: [{
						title: '<span style="color:red;">民航局</span>:加强航空物流关键环节防控 进一步强化外防输入',
						content: '国务院联防联控机制召开新闻发布会，介绍冬季疫情防控相关情况。<span style="color:red;">民航局</span>飞行标准司副司长韩光祖在发布会上介绍，目前，外防输入、做好“人物同防”是民航疫情防控工作的关键点。<span style="color:red;">民航局</span>通过加强航空物流关键环节防控，全面加强来华航班管理，继续严格实施熔断措施等，...',
						type: "info",
						date: '2020-12-03',
						href: "https://element.eleme.io"
					}, {
						title: '<span style="color:red;">民航局</span>:加强航空物流关键环节防控 进一步强化外防输入',
						content: '国务院联防联控机制召开新闻发布会，介绍冬季疫情防控相关情况。<span style="color:red;">民航局</span>飞行标准司副司长韩光祖在发布会上介绍，目前，外防输入、做好“人物同防”是民航疫情防控工作的关键点。<span style="color:red;">民航局</span>通过加强航空物流关键环节防控，全面加强来华航班管理，继续严格实施熔断措施等，...',
						type: "info",
						date: '2020-12-03',
						href: "https://element.eleme.io"
					}],
					arrVideo: [{
						title: '<span style="color:red;">民航局</span>:对疫情严重国家、确有困难急需回国的留学人员回国提供便利',
						content: '',
						type: "video",
						img: "/src/assets/images/search/u189.png",
						src: "",
						date: '2020-12-03',
						href: "https://element.eleme.io"
					}]
				},
				//时间快捷选择
				arrShortcut: [{
					value: "all",
					title: "全部"
				}, {
					value: "day",
					title: "一天内"
				}, {
					value: "week",
					title: "一周内"
				}, {
					value: "moth",
					title: "一月内"
				}, {
					value: "year",
					title: "一年内"
				}],
				//当前选中的快捷时间
				shortcutActive: "",
				//搜索工具显示
				showSearchTool: false
			}
		},
		methods: {
			//级联选择
			handleChange() {

			},
			//快捷时间选择
			setShortcut(item) {
				if (this.shortcutActive == item.value) {
					this.shortcutActive = ""
				} else {
					this.shortcutActive = item.value
				}
			},
			// 检索方法
			doSearch() {
				this.objSearchData.arrDoc = this.objSearchData.arrDoc
				this.objSearchData.arrInfo = this.objSearchData.arrInfo
				this.objSearchData.arrVideo = this.objSearchData.arrVideo
			},
			//切换搜索工具显示方式
			changeSearchTool() {
				this.showSearchTool = !this.showSearchTool
			},
			//根据关联程度排序
			changeSortByRelevance() {
				this.$message({
					type: "success",
					message: "相关程度!"
				})
			},
			//根据时间排序
			changeSortByTime() {
				this.$message({
					type: "success",
					message: "发布时间!"
				})
			},
			//切换排序方式 sec(正序)、des(倒序)
			changeSortType() {
				console.log(this.formData.searchSort)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.search {
		width: 1200px;
		margin: 0 auto;
		padding: 20px 0;

		/* 搜索条件表单 */
		.search-form {

			.search-form-main {
				// width: 1000px;
				margin: 0 auto;
			}

			/* 搜索框 */
			.search-input {
				margin: 0 20px;
				width: 600px;

				/deep/ .el-input-group__append {
					background-color: $first-color;
					color: $font-color1;
					border: 1px solid $first-color;
				}
			}

			.search-form-item {
				margin-bottom: 22px;
				line-height: 40px;

				/* 级联选择 */
				.search-cascader {

					/deep/ .el-input {
						width: 200px;
					}
				}

				/* 单选按钮组 */
				.search-radio-group {
					width: 200px;
				}

				.el-radio-group,
				.el-radio {
					line-height: inherit;
				}

				/* 时间选择框 */
				.search-date {
					margin-left: 20px;
				}
			}

			/* 搜索工具切换显示状态 */
			.change-search-tool {
				margin-left: 80px;
			}

			/* 搜索结果数提示 */
			.search-result {
				height: 40px;
				color: $font-color3;
				font-size: 14px;
			}

			/* 排序 */
			.search-sort {
				margin-left: 50px;
				height: 40px;

				.search-sort-title {
					font-weight: bold;
				}
				
				.search-sort-item.active{
					color: $first-color;
				}

				.el-link {
					margin: 0 10px;
					font-size: 16px;
				}

				/* 排序方式 */
				.search-sort-type {
					margin-left: 50px;
				}
			}
		}

		/* 搜索结果列表 */
		.search-content {
			flex-wrap: nowrap;

			.search-list {
				padding-right: 20px;
				width: 900px;

				.search-list-title {
					line-height: 50px;
					font-weight: bold;
				}

				.search-list-content {
					padding: 0 20px;

					.search-item {
						position: relative;
						width: 100%;
						line-height: 30px;
						font-size: 16px;
						margin-bottom: 30px;
						justify-content: space-between;

						>a {
							color: inherit;
							flex-wrap: nowrap;
							justify-content: space-between;
						}

						>a:hover {
							color: #409EFF;
						}

						.search-item-title {}

						.search-item-content {
							color: $font-color3;
							font-size: 14px;
						}

						.search-item-date {
							width: 120px;
							color: $font-color3;
							text-align: right;
						}

						.search-important-news {
							position: absolute;
							right: 20px;
							bottom: 0px;
							padding: 0px 5px;
							line-height: 25px;
							background-color: rgba(255, 255, 255, 0);
							box-sizing: border-box;
							border: 1px solid rgba(204, 204, 204, 1);
							-webkit-border-radius: 3px;
							-moz-border-radius: 3px;
							border-radius: 3px;
							font-weight: 400;
							font-style: normal;
							font-size: 12px;
							color: #999999;
							z-index: 100;
						}

						.search-video-img {
							width: 260px;
							height: 178px;

							img {
								height: 100%;
								width: 100%;
							}
						}
					}

					.search-item-video {
						width: 280px;
						margin: 0 20px 5px;
					}
				}
			}

			.search-shortcut-time {
				width: 300px;
				height: 200px;
				height: max-content;
				padding: 50px 30px;
				background-color: rgba(242, 242, 242, 1);

				li {
					font-size: 20px;
					line-height: 40px;
					padding: 0 10px;
					cursor: pointer;

					>span {
						margin-right: 20px;
					}
				}

				li.active {
					background-color: #FFFFFF;
					font-weight: bold;
					color: rgb(246, 140, 32);
				}

				li:hover {
					color: rgba(92, 173, 255, 1);
				}
			}
		}

		/* 分页 */
		.pagination {
			margin-top: 30px;
		}
	}
</style>
