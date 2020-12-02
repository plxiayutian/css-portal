/**
 * create by penglei
 * 2020.10.16
 * */

/**
 * 时间格式化
 * 调用方式new Date().format("yyyy-MM-dd  hh:mm:ss");
 * 参数既是时间格式
 */
Date.prototype.Format = function(formatStr) {
	var str = formatStr;
	var Week = ['日', '一', '二', '三', '四', '五', '六'];
	//年月日匹配
	str = str.replace(/yyyy|YYYY/, this.getFullYear());
	str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() %
		100));
	var month = this.getMonth() + 1;
	str = str.replace(/MM/, month > 9 ? month.toString() : '0' + month);
	str = str.replace(/M/g, month);
	str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	str = str.replace(/d|D/g, this.getDate());
	//分隔符匹配
	str = str.replace(/w|W/g, Week[this.getDay()]);
	//时分秒匹配
	str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	str = str.replace(/h|H/g, this.getHours());
	str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	str = str.replace(/m/g, this.getMinutes());
	str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	str = str.replace(/s|S/g, this.getSeconds());
	return str;
}
Date.prototype.format = function(formatStr) {
	var str = formatStr;
	var Week = ['日', '一', '二', '三', '四', '五', '六'];
	//年月日匹配
	str = str.replace(/yyyy|YYYY/, this.getFullYear());
	str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() %
		100));
	var month = this.getMonth() + 1;
	str = str.replace(/MM/, month > 9 ? month.toString() : '0' + month);
	str = str.replace(/M/g, month);
	str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	str = str.replace(/d|D/g, this.getDate());
	//分隔符匹配
	str = str.replace(/w|W/g, Week[this.getDay()]);
	//时分秒匹配
	str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	str = str.replace(/h|H/g, this.getHours());
	str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	str = str.replace(/m/g, this.getMinutes());
	str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	str = str.replace(/s|S/g, this.getSeconds());
	return str;
}

/**
 * 时间加减计算
 * 参数：
 *      type：加减类型 1（加）  2（减）
 *      value：按时间毫秒数传递的时间加减数值
 *            毫秒：num
 *            秒：num*1000
 *            分：num*1000*60
 *            时：num*1000*60*60
 *            天：num*1000*60*60*24
 *      classValue：特殊的值处理，月：M/m   年：Y/y
 *            value：传入加减的月数或年数，加正减负
 * 返回值：计算后的时间毫秒数
 */
Date.prototype.calculation = function(type, value, classValue) {
	type = type || 1;
	var msecTime = this.getTime(); //时间毫秒
	var calculationTime = null;
	if (!classValue) {
		calculationTime = type == 2 ? msecTime - value : msecTime + value; //1加 2减
	} else if (classValue.toString.toLocaleUpperCase() == "M") { //月   classValue.toString.toLocaleLowerCase() == "m" ||
		calculationTime = this.addMonths(value);
	} else if (classValue.toString.toLocaleLowerCase() == "y" || classValue.toString.toLocaleUpperCase() == "Y") { //年
		calculationTime = this.addYears(value);
	}
	return calculationTime;
}
//月计算
Date.prototype.addMonths = function(m) {
	var d = this.getDate();
	this.setMonth(this.getMonth() + m);
	if (this.getDate() < d)
		this.setDate(0);
};
//年计算
Date.prototype.addYears = function(y) {
	var m = this.getMonth();
	this.setFullYear(this.getFullYear() + y);
	if (m < this.getMonth()) {
		this.setDate(0);
	}
};

//其它方法集合
export default {
	/**
	 * 阻止事件传播
	 */
	StopBubble: function(e) {
		// 如果提供了事件对象，则这是一个非IE浏览器
		if (e && e.stopPropagation) {
			// 因此它支持W3C的stopPropagation()方法 
			e.stopPropagation();
		} else {
			// 否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
		}
	},
	/**
	 * 阻止事件默认行为
	 */
	StopDefault: function(e) {
		// 阻止默认浏览器动作(W3C)
		if (e && e.preventDefault) {
			e.preventDefault();
		} else {
			// IE中阻止函数器默认动作的方式
			window.event.returnValue = false;
		}
		return false;
	},
	// 获取指定名称的cookie
	GetCookie: function(name) {
		var strcookie = document.cookie; //获取cookie字符串
		var arrcookie = strcookie.split(";"); //分割
		if (arrcookie.length > 0) {
			//遍历匹配
			for (var i = 0; i < arrcookie.length; i++) {
				var arr = arrcookie[i].split("=");
				if (arr[0] == name) {
					return arr[1];
				}
			}
		}
		return "";
	},
	/**
	 * String 对象,去掉字符串前后空格
	 */
	Trim: function(str) {
		if (typeof str == "string") {
			return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
		}
	},
	/**
	 *获取地址栏参数
	 * name:参数名称
	 */
	GetUrlParametes: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var strSearch = window.location.search;
		var arrChart = strSearch.match(/\?/gi);
		var tIndex = 0; //地址栏中最后一个“?”的位置
		if (arrChart && arrChart.length > 1) {
			tIndex = strSearch.lastIndexOf("?")
		}
		var r = strSearch.substr(tIndex + 1).match(reg);
		if (r != null)
			return decodeURIComponent(r[2]);
		return null; //decodeURIComponent  unescape
	},
	/**
	 *获取浏览器类型和版本
	 */
	GetBrowserInfo: function() {
		var Sys = {};
		var ua = navigator.userAgent.toLowerCase();
		var re = /(msie|trident|firefox|chrome|opera|version).*?([\d.]+)/;
		var m = ua.match(re);
		Sys.browser = m[1].replace(/version/, "'safari");
		Sys.ver = m[2];
		return Sys;
	},
	/**
	 *深度克隆
	 * 最简单的克隆方式：JSON.stringify()-->JSON.parse()
	 * obj：克隆对象或数组
	 */
	DeepClone: function(obj) {
		var result, oClass = isClass(obj);
		//确定result的类型
		if (oClass === "Object") {
			result = {};
		} else if (oClass === "Array") {
			result = [];
		} else {
			return obj;
		}
		for (key in obj) {
			var copy = obj[key];
			if (isClass(copy) == "Object") {
				result[key] = arguments.callee(copy); //递归调用
			} else if (isClass(copy) == "Array") {
				result[key] = arguments.callee(copy);
			} else {
				result[key] = obj[key];
			}
		}
		return result;
	},
	/**
	 * 返回对象的基类(判断数据类型)
	 * o:变量
	 */
	CallBackClass: function(o) {
		if (o === null) return "Null";
		if (o === undefined) return "Undefined";
		//引用类型："[object Array]"、"[object Object]"、"[object RegExp]"、"[object Date]"、"[object Function]"
		//基本类型："[object String]"、"[object Number]"--（包括NaN）、"[object Null]"、"[object Undefined]"
		return Object.prototype.toString.call(o).slice(8, -1); //返回数据类型的字符串
	},
	/**
	 *获取子iframe的document
	 *参数：iframe标签的DOM
	 */
	GetIframeDocument: function(iframe) {
		var Doc;
		try {
			Doc = iframe.contentWindow.document; // For IE5.5 and IE6
		} catch (ex) {}
		if (!Doc) {
			Doc = iframe.contentDocument; // For NS6
		}
		return Doc;
	},
	/**
	 *数组去重 对象键值法,简单数组
	 */
	ArrayUniq: function(array) {
		var temp = {},
			r = [],
			len = array.length,
			val, type;
		for (var i = 0; i < len; i++) {
			val = array[i];
			type = typeof val;
			if (!temp[val]) {
				temp[val] = [type];
				r.push(val);
			} else if (temp[val].indexOf(type) < 0) {
				temp[val].push(type);
				r.push(val);
			}
		}
		return r;
	},
	/**
	 *数组去重 复杂数组，数组套对象
	 *arr:当前需要去重的数组
	 *key:根据数组中对象的某个键去重
	 */
	ArrayObjUniq: function(arr, key) {
		var obj = {};
		arr = arr.reduce(function(item, next) {
			obj[next[key]] ? '' : obj[next[key]] = true && item.push(next);
			return item;
		}, []);
		return arr;
	},
	/**
	 *页面打印
	 *printHtml:打印区域的DOM，有则区域打印，没有则页面打印
	 */
	PrintPreview: function(printHtml) {
		try {
			if (printHtml) {
				var bdhtml = window.document.body.innerHTML; //获取页面的html代码
				var prnhtml = printHtml.innerHTML; //获取页面打印区域的html代码
				window.document.body.innerHTML = prnhtml;
				window.print();
				window.document.body.innerHTML = bdhtml;
			} else {
				window.print();
			}
		} catch (e) {
			window.print();
		}
	},
	/**
	 *本地存储兼容处理
	 *低版本IE：UserData，标准浏览器：localStorage
	 */
	AllLocalStorage: function() {
		var UserData = {
			userData: null,
			name: location.hostname,
			//this.name = "css88.com";
			init: function() {
				if (!UserData.userData) {
					try {
						UserData.userData = document.createElement('INPUT');
						UserData.userData.type = "hidden";
						UserData.userData.style.display = "none";
						UserData.userData.addBehavior("#default#userData");
						document.body.appendChild(UserData.userData);
						var expires = new Date();
						expires.setDate(expires.getDate() + 365);
						UserData.userData.expires = expires.toUTCString();
					} catch (e) {
						return false;
					}
				}
				return true;
			},
			setItem: function(key, value) {
				if (UserData.init()) {
					UserData.userData.load(UserData.name);
					UserData.userData.setAttribute(key, value);
					UserData.userData.save(UserData.name);
				}
			},
			getItem: function(key) {
				if (UserData.init()) {
					UserData.userData.load(UserData.name);
					return UserData.userData.getAttribute(key)
				}
			},
			removeItem: function(key) {
				if (UserData.init()) {
					UserData.userData.load(UserData.name);
					UserData.userData.removeAttribute(key);
					UserData.userData.save(UserData.name);
				}

			}
		};
		var _locStorage = null;
		if (typeof localStorage == "object") {
			_locStorage = localStorage;
		} else {
			_locStorage = UserData;
		}
		return {
			setItem: function(map, value) {
				if (typeof value != "undefined") {
					_locStorage.setItem(map, value);
				} else if (typeof map === "object") {
					for (var i in map) {
						_locStorage.setItem(i, map[i]);
					}
				}
			},
			getItem: function(key) {
				return _locStorage.getItem(key);
			},
			removeItem: function(keys) {
				if (typeof keys == "string") {
					keys = [keys];
				}
				for (var i = 0, len = keys.length; i < len; i++) {
					_locStorage.removeItem(keys[i]);
				}
			}
		}
	},
	/**
	 *图片预加载
	 * url:图片地址
	 * callback加载完成后的回调函数
	 */
	PreLoadImg: function(url, callback) {
		var img = new Image();
		img.src = url;
		img.onload = function() {
			if (callback) {
				callback();
			}
		}
	},
	/**
	 * 阿拉伯数字转汉字
	 */
	TransformToChinese: function(num) {
		var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
		var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
		var chnUnitChar = ["", "十", "百", "千"];
		var numToChn = function(num) {
			var index = num.toString().indexOf(".");
			if (index != -1) {
				var str = num.toString().slice(index);
				var a = "点";
				for (var i = 1; i < str.length; i++) {
					a += chnNumChar[parseInt(str[i])];
				}
				return a;
			} else {
				return '';
			}
		}

		//定义在每个小节的内部进行转化的方法，其他部分则与小节内部转化方法相同
		function sectionToChinese(section) {
			var str = '',
				chnstr = '',
				zero = false,
				count = 0; //zero为是否进行补零， 第一次进行取余由于为个位数，默认不补零
			while (section > 0) {
				var v = section % 10; //对数字取余10，得到的数即为个位数
				if (v == 0) { //如果数字为零，则对字符串进行补零
					if (zero) {
						zero = false; //如果遇到连续多次取余都是0，那么只需补一个零即可
						chnstr = chnNumChar[v] + chnstr;
					}
				} else {
					zero = true; //第一次取余之后，如果再次取余为零，则需要补零
					str = chnNumChar[v];
					str += chnUnitChar[count];
					chnstr = str + chnstr;
				}
				count++;
				section = Math.floor(section / 10);
			}
			return chnstr;
		}

		var a = numToChn(num);
		num = Math.floor(num);
		var unitPos = 0;
		var strIns = '',
			chnStr = '';
		var needZero = false;

		if (num === 0) {
			return chnNumChar[0];
		}
		while (num > 0) {
			var section = num % 10000;
			if (needZero) {
				chnStr = chnNumChar[0] + chnStr;
			}
			strIns = sectionToChinese(section);
			strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
			chnStr = strIns + chnStr;
			needZero = (section < 1000) && (section > 0);
			num = Math.floor(num / 10000);
			unitPos++;
		}
		return chnStr + a;
	},
	/**
	 * 保留有*位效数字
	 value:值
	 len:有效数字位数
	 */
	ToPrecisionNumber: function(value, len) {
		if (value && value != '0') {
			value = Number(value);
			if (value < 1) {
				if (Math.pow(10, -(len - 1)) > value) {
					value = '';
				} else {
					value = value.toFixed(len - 1);
				}
			} else if (value > Math.pow(10, len)) {
				value = parseInt(value);
			} else {
				value = value.toPrecision(3);
			}
		} else {
			if (value == 0 || value == "0.0") {
				value = 0;
			} else {
				value = '';
			}
		}
		return value;
	},
	/**
	 * 通过方法名调用函数
	 */
	Call: function() {
		if (arguments.length <= 0) return;
		if (typeof(arguments[0]) != 'string') return;
		var params = [];
		for (var i = 1; i < arguments.length; i++)
			params.push(arguments[i]);
		return this[arguments[0]].apply(null, params);
	},
	/**
	 * 通用浏览器全屏的处理方法
	 */
	LaunchFullScreen: function(element) { //开启全屏
		if (element.requestFullscreen) { //W3C
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) { //FireFox
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) { //Chrome等
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) { //IE11
			element.msRequestFullscreen();
		}
	},
	//aunchFullScreen(document.documentElement); // 整个网页
	//LaunchFullScreen(document.getElementById("videoElement")); // 某个页面元素
	/**
	 * 退出浏览器全屏
	 */
	ExitFullScreen: function(doc) {
		var document = doc ? doc : document;
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
		//window.close();
	},
	//判断是否全屏
	//var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
	//var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
	/**
	 * 浏览器全屏切换
	 */
	Fullscreenchange: function() {
		var isFull = window.fullScreen || document.webkitIsFullScreen || document.mozFullScreenEnabled || document.msFullscreenEnabled; //document.fullscreenEnabled ||  Chrome浏览器更新到最新的版本后默认值为true
		if (isFull === undefined) {
			isFull = false;
		}
		if (!isFull) {
			launchFullScreen(document.documentElement);
		} else {
			exitFullScreen();
		}
	},
	/**
	 * 弹出新建浏览器窗口--可配置显示浏览工具栏
	 * url:页面路径, attr:新窗口属性
	 */
	OpenWindow: function(url, attr) {
		if (url) {
			var strAttr = "";
			if (attr) {
				strAttr += "channelmode=" + (attr.channelmode || "yes"); //是否使用剧院模式显示窗口
				strAttr += "directories=" + (attr.directories || "no"); //是否添加目录按钮
				strAttr += ",fullscreen=" + (attr.fullscreen || "yes"); //是否使用全屏模式显示浏览器
				strAttr += ",location=" + (attr.location || "no"); //是否显示地址字段
				strAttr += ",menubar=" + (attr.menubar || "no"); //是否显示菜单栏
				strAttr += ",resizable=" + (attr.resizable || "no"); //窗口是否可调节尺寸
				strAttr += ",scrollbars=" + (attr.scrollbars || "no"); //是否显示滚动条
				strAttr += ",status=" + (attr.status || "no"); //是否添加状态栏
				strAttr += ",titlebar=" + (attr.titlebar || "no"); //是否显示标题栏
				strAttr += ",toolbar=" + (attr.toolbar || "no"); //是否显示浏览器的工具栏
				strAttr += ",top=" + (attr.top || 0); //窗口的 y 坐标
				strAttr += ",left=" + (attr.left || 0); //窗口的 x 坐标
				strAttr += ",width=" + (attr.width || window.screen.availWidth - 10); //窗口的文档显示区的宽度。以像素计。
				strAttr += ",height=" + (attr.height || window.screen.availHeight - 60); //窗口文档显示区的高度。以像素计。
			} else {
				strAttr =
					'channelmode=yes,fullscreen=yes,location=no,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no,top=0,left=0,width=' +
					(window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 60); //默认
			}
			window.open(url, '_blank', strAttr);
		} else {
			console.log("请传入页面路径！");
		}
	},
	/**
	 * 关闭浏览器窗口
	 *
	 */
	CloseWindow: function() {
		var Browser = navigator.appName;
		var indexB = Browser.indexOf('Explorer');
		if (indexB > 0) {
			var indexV = navigator.userAgent.indexOf('MSIE') + 5;
			var Version = navigator.userAgent.substring(indexV, indexV + 1);
			if (Version >= 7) {
				window.open('', '_self', '');
				window.close();
			} else if (Version == 6) {
				window.opener = null;
				window.close();
			} else {
				window.opener = '';
				window.close();
			}
		} else {
			window.close();
		}
	},
	/**
	 * 文档下载
	 * url:资源文档路径
	 */
	DownloadDocument: function(url) {
		if (!!window.ActiveXObject || 'ActiveXObject' in window) { // IE
			window.open(url, '_blank')
		} else {
			var a = document.createElement('a'); // 创建a标签
			var e = document.createEvent('MouseEvents'); // 创建鼠标事件对象
			e.initEvent('click', false, false); // 初始化事件对象
			a.href = url; // 设置下载地址
			a.target = '_blank'; // 重新打开浏览器窗口下载
			a.download = ''; // 设置下载文件名
			a.dispatchEvent(e); // 阻止事件默认行为
		}
	},
	/**
	 * 根据文档后缀判断文档类型
	 */
	GetFileType: function(fileName) {
		// 后缀获取
		let suffix = '';
		// 获取类型结果
		let result = '';
		try {
			const flieArr = fileName.split('.');
			suffix = flieArr[flieArr.length - 1];
		} catch (err) {
			suffix = '';
		}
		// fileName无后缀返回 false
		if (!suffix) {
			return false;
		}
		suffix = suffix.toLocaleLowerCase();
		/* //ES6语法
		// 图片格式
		const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
		// 进行图片匹配
		result = imglist.find(item => item === suffix);
		if (result) {
		    return 'image';
		}
		// 匹配txt
		const txtlist = ['txt'];
		result = txtlist.find(item => item === suffix);
		if (result) {
		    return 'txt';
		}
		//或正则：const reg=/\.xl(s[xmb]|t[xm]|am|s)$/g  reg.test(suffix);
		// 匹配 excel
		const excelist = ['xls', 'xlsx', 'csv'];
		result = excelist.find(item => item === suffix);
		if (result) {
		    return 'excel';
		}
		// 匹配 word
		const wordlist = ['doc', 'docx', 'rtf'];
		result = wordlist.find(item => item === suffix);
		if (result) {
		    return 'word';
		}
		// 匹配 pdf
		const pdflist = ['pdf'];
		result = pdflist.find(item => item === suffix);
		if (result) {
		    return 'pdf';
		}
		// 匹配 ppt
		const pptlist = ['ppt', 'pptx'];
		result = pptlist.find(item => item === suffix);
		if (result) {
		    return 'ppt';
		}
		// 匹配 视频
		const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v', 'ogv'];
		result = videolist.find(item => item === suffix);
		if (result) {
		    return 'video';
		}
		// 匹配 音频
		const radiolist = ['mp3', 'wav', 'wmv', 'oga'];
		result = radiolist.find(item => item === suffix);
		if (result) {
		    return 'radio';
		}*/
		// 图片格式
		var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
		// 进行图片匹配
		if (imglist.indexOf(suffix) != -1) {
			return 'image';
		}
		// 匹配txt
		var txtlist = ['txt'];
		if (txtlist.indexOf(suffix) != -1) {
			return 'txt';
		}
		//或正则：var reg=/\.xl(s[xmb]|t[xm]|am|s)$/g  reg.test(suffix);
		// 匹配 excel
		var excelist = ['xls', 'xlsx', 'csv'];
		if (excelist.indexOf(suffix) != -1) {
			return 'excel';
		}
		// 匹配 word
		var wordlist = ['doc', 'docx', 'rtf'];
		if (wordlist.indexOf(suffix) != -1) {
			return 'word';
		}
		// 匹配 pdf
		var pdflist = ['pdf'];
		if (pdflist.indexOf(suffix) != -1) {
			return 'pdf';
		}
		// 匹配 ppt
		var pptlist = ['ppt', 'pptx'];
		if (pptlist.indexOf(suffix) != -1) {
			return 'ppt';
		}
		// 匹配 视频
		var videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v', 'ogv'];
		if (videolist.indexOf(suffix) != -1) {
			return 'video';
		}
		// 匹配 音频
		var radiolist = ['mp3', 'wav', 'wmv', 'oga'];
		if (radiolist.indexOf(suffix) != -1) {
			return 'radio';
		}
		// 其他 文件类型
		return 'other';
	},
	/**
	 * 序列化表单元素为JSON对象
	 * @param form          Form表单id或表单jquery DOM对象
	 * @returns {{}}
	 */
	serialize: function(form) {
		var $form = (typeof(form) == "string" ? $("#" + form) : form);
		var dataArray = $form.serializeArray(),
			result = {};
		$(dataArray).each(function() {
			if (result[this.name]) {
				result[this.name].push(this.value);
			} else {
				var element = $form.find("[name='" + this.name + "']")[0];
				var type = (element.type || element.nodeName).toLowerCase();
				result[this.name] = (/^(select-multiple|checkbox)$/i).test(type) ? [this.value] : this.value;
			}
		});
		return result;
	},
	/**
	 * 设置表单值
	 * @param form          Form表单id或表单jquery DOM对象
	 * @param data          json对象，多选时为数组
	 * 代码实现参考此开源项目https://github.com/kflorence/jquery-deserialize/
	 */
	deserialize: function(form, data) {
		var rcheck = /^(?:radio|checkbox)$/i,
			rselect = /^(?:option|select-one|select-multiple)$/i,
			rvalue =
			/^(?:button|color|date|datetime|datetime-local|email|hidden|month|number|password|range|reset|search|submit|tel|text|textarea|time|url|week)$/i;
		var $form = (typeof(form) == "string" ? $("#" + form) : form);

		//得到所有表单元素
		function getElements(elements) {
			return elements.map(function() {
				return this.elements ? jQuery.makeArray(this.elements) : this;
			}).filter(":input:not(:disabled)").get();
		}

		//把表单元素转为json对象
		function elementsToJson(elements) {
			var current, elementsByName = {};
			jQuery.each(elements, function(i, element) {
				current = elementsByName[element.name];
				elementsByName[element.name] = current === undefined ? element :
					(jQuery.isArray(current) ? current.concat(element) : [current, element]);
			});
			return elementsByName;
		}

		var elementsJson = elementsToJson(getElements($form));
		for (var key in data) {
			var val = data[key];
			var dataArr = [];
			if ($.isArray(val)) {
				for (var i = 0, v; v = val[i++];) {
					dataArr.push({
						name: key,
						value: v
					});
				}
			} else {
				dataArr.push({
					name: key,
					value: val
				});
			}
			for (var m = 0, vObj; vObj = dataArr[m++];) {
				var element;
				//如果表单中无元素则跳过
				if (!(element = elementsJson[vObj.name])) {
					continue;
				}
				var type = element.length ? element[0] : element;
				type = (type.type || type.nodeName).toLowerCase();
				var property = null;
				if (rvalue.test(type)) {
					element.value = (typeof(vObj.value) == "undefined" || vObj.value == null) ? "" : vObj.value;
				} else if (rcheck.test(type)) {
					property = "checked";
				} else if (rselect.test(type)) {
					property = "selected";
				}
				//设置选中
				if (property) {
					for (var n = 0, e; e = element[n++];) {
						if (e.value == vObj.value) {
							e[property] = true;
						}
					}
				}
			}
		}
	}
};
