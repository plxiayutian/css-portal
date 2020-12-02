var selectArea = {};

var isMoveDown = false;
//起始位置x、y坐标
var downX, downY;
//坐标位
var beginX, endX, beginY, endY;
//栅格宽高
var modularWidth, modularHeight;

/* 重置数据 */
function resetData() {
	downX = undefined;
	downY = undefined;
	beginX = undefined;
	endX = undefined;
	beginY = undefined;
	endY = undefined;
}

/* 初始化模块 */
selectArea.init = function(vo) {
	var beginX = vo.beginX,
		beginY = vo.beginY,
		endX = vo.endX,
		endY = vo.endY;

	var curTop = beginY * modularHeight + "px", //模块到顶部距离
		curLeft = beginX * modularWidth + "%", //模块到左侧距离
		curWidth = (endX - beginX + 1) * modularWidth + "%", //模块宽度
		curHeight = (endY - beginY + 1) * modularHeight - 2 + "px"; //模块高度

	// 判断是否有资源
	if (vo.portalResourceId) {
		return {
			id: vo.moduleId,
			moduleName: vo.moduleName,
			curTop: curTop,
			curLeft: curLeft,
			curWidth: curWidth,
			curHeight: curHeight,
			isLocked: vo.isLocked,
			showModuleName: true,
			draggableElement: {
				//如果resourceEntity不存在则取resourceVO
				draggableElementType: vo.resourceEntity ? vo.resourceEntity.type : vo.resourceVO ? vo.resourceVO.type : null,
				draggableModuleId: vo.moduleId,
				draggableResourceId: vo.portalResourceId
			},
			resourceVO: vo.resourceVO
		}
	} else {
		return {
			id: vo.moduleId,
			moduleName: vo.moduleName,
			curTop: curTop,
			curLeft: curLeft,
			curWidth: curWidth,
			curHeight: curHeight,
			isLocked: vo.isLocked
		}
	}
}

/* 鼠标按下事件 */
selectArea.mousedown = function(x, y, isAdd) {
	if (isAdd) {
		//重置坐标数据
		resetData();
		//鼠标是否按下拖动
		isMoveDown = true;

		// 获取起始位置x坐标
		downX = x;
		// 获取起始位置y坐标
		downY = y;
	}
}

/* 鼠标进入事件 */
selectArea.mouseenter = function(x, y) {
	if (isMoveDown) {
		// 获取结束位置x坐标
		var upX = x;
		// 获取结束位置y坐标
		var upY = y;

		beginX = downX < upX ? downX : upX;
		endX = downX < upX ? upX : downX;
		beginY = downY < upY ? downY : upY;
		endY = downY < upY ? upY : downY;

		// 清空所有选中
		$("div.el-row div.el-col").each(function(i) {
			$(this).removeClass('td_change');
		})

		for (var i = beginX; i <= endX; i++) {
			for (var j = beginY; j <= endY; j++) {
				$('div[lang=\'(' + i + ',' + j + ')\']').addClass('td_change');
			}
		}
	}
}

/* 鼠标松开事件 */
selectArea.mouseup = function(width, height, isAdd) {
	if (isAdd) {
		isMoveDown = false;
		for (var i = beginX; i <= endX; i++) {
			for (var j = beginY; j <= endY; j++) {
				$('div[lang=\'(' + i + ',' + j + ')\']').removeClass('td_change');
			}
		}
		selectArea.calculateGrid(width, height);

		var curTop = beginY * modularHeight + "px", //模块到顶部距离
			curLeft = beginX * modularWidth + "%", //模块到左侧距离
			curWidth = (endX - beginX + 1) * modularWidth + "%", //模块宽度
			curHeight = (endY - beginY + 1) * modularHeight - 2 + "px", //模块高度
			curId = beginX + beginY + endX + endY;

		return {
			id: curId,
			curTop: curTop,
			curLeft: curLeft,
			curWidth: curWidth,
			curHeight: curHeight,
			beginX: beginX,
			beginY: beginY,
			endX: endX,
			endY: endY
		}
	}
}

/* 计算栅格的宽高 */
selectArea.calculateGrid = function(width, height) {
	if (width.indexOf('px') != -1) {
		// 包含px
		modularWidth = Number(width.substr(0, width.indexOf('px')));
	} else if (width.indexOf('%') != -1) {
		// 包含%
		modularWidth = Number(width.substr(0, width.indexOf('%')));
	} else {
		// 直接写数值
		modularWidth = Number(width);
	}

	if (height.indexOf('px') != -1) {
		// 包含px
		modularHeight = Number(height.substr(0, height.indexOf('px')));
	} else if (width.indexOf('%') != -1) {
		// 包含%
		modularHeight = Number(height.substr(0, height.indexOf('%')));
	} else {
		// 直接写数值
		modularHeight = Number(height);
	}
}

// 导出变量
export default selectArea;
