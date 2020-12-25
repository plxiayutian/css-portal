<template>
	<div id="searchHeader" class="search-header">
		<div class="system-title">中国民用航空局</div>
	</div>
</template>

<script>
	export default {
		name: "searchHeader",
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-header {
		width: 100%;
		height: 100px;
		font-family: '华文中宋 Bold', '华文中宋 Regular', '华文中宋';
		font-weight: 700;
		font-style: normal;
		font-size: 36px;
		color: #FFFFFF;
		background-color: rgba(92, 173, 255, 1);
		position: relative;

		.system-title {
			position: absolute;
			top: 26px;
			height: 48px;
			line-height: 48px;
			margin-left: 50px;
		}
	}
</style>
