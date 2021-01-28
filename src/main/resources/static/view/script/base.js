const root = "http://localhost:8080";
const debug = true;

// cookie
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

// md5
(function($){

var rotateLeft = function(lValue, iShiftBits) {
return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
}

var addUnsigned = function(lX, lY) {
var lX4, lY4, lX8, lY8, lResult;
lX8 = (lX & 0x80000000);
lY8 = (lY & 0x80000000);
lX4 = (lX & 0x40000000);
lY4 = (lY & 0x40000000);
lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
if (lX4 | lY4) {
if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
} else {
return (lResult ^ lX8 ^ lY8);
}
}

var F = function(x, y, z) {
return (x & y) | ((~ x) & z);
}

var G = function(x, y, z) {
return (x & z) | (y & (~ z));
}

var H = function(x, y, z) {
return (x ^ y ^ z);
}

var I = function(x, y, z) {
return (y ^ (x | (~ z)));
}

var FF = function(a, b, c, d, x, s, ac) {
a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
return addUnsigned(rotateLeft(a, s), b);
};

var GG = function(a, b, c, d, x, s, ac) {
a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
return addUnsigned(rotateLeft(a, s), b);
};

var HH = function(a, b, c, d, x, s, ac) {
a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
return addUnsigned(rotateLeft(a, s), b);
};

var II = function(a, b, c, d, x, s, ac) {
a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
return addUnsigned(rotateLeft(a, s), b);
};

var convertToWordArray = function(string) {
var lWordCount;
var lMessageLength = string.length;
var lNumberOfWordsTempOne = lMessageLength + 8;
var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
var lWordArray = Array(lNumberOfWords - 1);
var lBytePosition = 0;
var lByteCount = 0;
while (lByteCount < lMessageLength) {
lWordCount = (lByteCount - (lByteCount % 4)) / 4;
lBytePosition = (lByteCount % 4) * 8;
lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
lByteCount++;
}
lWordCount = (lByteCount - (lByteCount % 4)) / 4;
lBytePosition = (lByteCount % 4) * 8;
lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
return lWordArray;
};

var wordToHex = function(lValue) {
var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
for (lCount = 0; lCount <= 3; lCount++) {
lByte = (lValue >>> (lCount * 8)) & 255;
WordToHexValueTemp = "0" + lByte.toString(16);
WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
}
return WordToHexValue;
};

var uTF8Encode = function(string) {
string = string.replace(/\x0d\x0a/g, "\x0a");
var output = "";
for (var n = 0; n < string.length; n++) {
var c = string.charCodeAt(n);
if (c < 128) {
output += String.fromCharCode(c);
} else if ((c > 127) && (c < 2048)) {
output += String.fromCharCode((c >> 6) | 192);
output += String.fromCharCode((c & 63) | 128);
} else {
output += String.fromCharCode((c >> 12) | 224);
output += String.fromCharCode(((c >> 6) & 63) | 128);
output += String.fromCharCode((c & 63) | 128);
}
}
return output;
};

$.extend({
md5: function(string) {
var x = Array();
var k, AA, BB, CC, DD, a, b, c, d;
var S11=7, S12=12, S13=17, S14=22;
var S21=5, S22=9 , S23=14, S24=20;
var S31=4, S32=11, S33=16, S34=23;
var S41=6, S42=10, S43=15, S44=21;
string = uTF8Encode(string);
x = convertToWordArray(string);
a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
for (k = 0; k < x.length; k += 16) {
AA = a; BB = b; CC = c; DD = d;
a = FF(a, b, c, d, x[k+0], S11, 0xD76AA478);
d = FF(d, a, b, c, x[k+1], S12, 0xE8C7B756);
c = FF(c, d, a, b, x[k+2], S13, 0x242070DB);
b = FF(b, c, d, a, x[k+3], S14, 0xC1BDCEEE);
a = FF(a, b, c, d, x[k+4], S11, 0xF57C0FAF);
d = FF(d, a, b, c, x[k+5], S12, 0x4787C62A);
c = FF(c, d, a, b, x[k+6], S13, 0xA8304613);
b = FF(b, c, d, a, x[k+7], S14, 0xFD469501);
a = FF(a, b, c, d, x[k+8], S11, 0x698098D8);
d = FF(d, a, b, c, x[k+9], S12, 0x8B44F7AF);
c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);
d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);
c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);
b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
a = GG(a, b, c, d, x[k+1], S21, 0xF61E2562);
d = GG(d, a, b, c, x[k+6], S22, 0xC040B340);
c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
b = GG(b, c, d, a, x[k+0], S24, 0xE9B6C7AA);
a = GG(a, b, c, d, x[k+5], S21, 0xD62F105D);
d = GG(d, a, b, c, x[k+10], S22, 0x2441453);
c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
b = GG(b, c, d, a, x[k+4], S24, 0xE7D3FBC8);
a = GG(a, b, c, d, x[k+9], S21, 0x21E1CDE6);
d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
c = GG(c, d, a, b, x[k+3], S23, 0xF4D50D87);
b = GG(b, c, d, a, x[k+8], S24, 0x455A14ED);
a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
d = GG(d, a, b, c, x[k+2], S22, 0xFCEFA3F8);
c = GG(c, d, a, b, x[k+7], S23, 0x676F02D9);
b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
a = HH(a, b, c, d, x[k+5], S31, 0xFFFA3942);
d = HH(d, a, b, c, x[k+8], S32, 0x8771F681);
c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
a = HH(a, b, c, d, x[k+1], S31, 0xA4BEEA44);
d = HH(d, a, b, c, x[k+4], S32, 0x4BDECFA9);
c = HH(c, d, a, b, x[k+7], S33, 0xF6BB4B60);
b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
d = HH(d, a, b, c, x[k+0], S32, 0xEAA127FA);
c = HH(c, d, a, b, x[k+3], S33, 0xD4EF3085);
b = HH(b, c, d, a, x[k+6], S34, 0x4881D05);
a = HH(a, b, c, d, x[k+9], S31, 0xD9D4D039);
d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
b = HH(b, c, d, a, x[k+2], S34, 0xC4AC5665);
a = II(a, b, c, d, x[k+0], S41, 0xF4292244);
d = II(d, a, b, c, x[k+7], S42, 0x432AFF97);
c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
b = II(b, c, d, a, x[k+5], S44, 0xFC93A039);
a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);
d = II(d, a, b, c, x[k+3], S42, 0x8F0CCC92);
c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
b = II(b, c, d, a, x[k+1], S44, 0x85845DD1);
a = II(a, b, c, d, x[k+8], S41, 0x6FA87E4F);
d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
c = II(c, d, a, b, x[k+6], S43, 0xA3014314);
b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
a = II(a, b, c, d, x[k+4], S41, 0xF7537E82);
d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235);
c = II(c, d, a, b, x[k+2], S43, 0x2AD7D2BB);
b = II(b, c, d, a, x[k+9], S44, 0xEB86D391);
a = addUnsigned(a, AA);
b = addUnsigned(b, BB);
c = addUnsigned(c, CC);
d = addUnsigned(d, DD);
}
var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
return tempValue.toLowerCase();
}
});
})(jQuery); 



/********************************
 * Input 类用于获取输入
 ********************************/
class Input {
    position(t) {
        return {
            x: t.pageX || t.clientX,
            y: t.pageY || t.clientY
        };
    }
}

var input = new Input();

/**********************************
 * normal：正常，什么事都没做
 * pull: 下拉刷新
 * turn: 滑动切换
 **********************************/
var status = "normal";

var componentID = 0;    // 创建组件使用此id来最大程度上避免重复

/** 下拉刷新组件 */

class PullView {
    // container: 滑动容器，在此容器上滑动产生相应效果
    // pullView：下拉组件，在滑动容器上下滑时此view下滑
    // props: 请求参数
    constructor(container, pullView, props) {
        this.container = $(container);
        this.pullView = $(pullView);
        this.props = props;
        if (!this.props.startDist) this.props.startDist = 30;
        if (!this.props.height) this.props.height = 300;
        if (!this.props.canRefreshDist) this.props.canRefreshDist = 100;
        if (!this.props.data) this.props.data = "";
        this.reset();
        this.callBack = props.callBack ? props.callBack : {};
        this.container.on('touchstart', e=>this.start(e));
        this.container.on('touchmove', e=>this.move(e));
        this.container.on('touchend', e=>this.end(e));
    }

    reset() {
        this.pull = false;
        this.canRefresh = false;
        this.startRefresh = false;
        this.refresh = false;
        this.endRefresh = false;
        this.pullView.animate({'margin-top': -300}, 200);
    }

    start(e) {
        if (status != "normal") return;
        this.startPos = input.position(e.touches[0]);
        const top = parseInt(this.container.scrollTop());
        if (top > 0) return;
        this.pull = true;
    };

    move(e) {
        if (!this.pull) return;
        const curPos = input.position(e.touches[0]);
        const dist = curPos.y - this.startPos.y;
        if (dist > this.props.startDist && dist <= this.props.height + this.props.startDist) {
            status = "pull";
            this.pullView.css('margin-top', -(this.props.height + this.props.startDist - dist));
        }

        if (!this.canRefresh && dist - this.props.startDist > this.props.canRefreshDist) {
            this.canRefresh = true;
            if (this.callBack.canRefresh)
                 this.callBack.canRefresh(this.container, this.pullView);
        }
    };

    end(e) {
        if (!this.pull) return;
        status = "normal";
        if (this.canRefresh && this.props.url) {
            $.post(this.props.url, this.props.data, (response, status, xhr)=> {
	        	if (this.callBack.success) this.callBack.success(response, status, xhr);
	        }).fail(()=> {
	        	if (this.callBack.error) this.callBack.error();
	        }).always(this.reset());
        } else {
            this.reset();
        }
    };
}

class Component {
    constructor(tag, props) {
        if (tag instanceof $) {
            this.element = $(tag);
        } else {
            let e = `<${tag}`;
            for (let x in props) if (props.hasOwnProperty(x)) {
                e += ` ${x}="${props[x]}"`;
            }
            e += `></${tag}>`;
            this.element = $(e);
        }
        this.e = this.element;
    }

    on(e, f) {
        this.element.on(e, f);
    }

    // 在元素后加入
    add(d) {
        d.addToContainer(this);
        return this;
    }

    // 将此元素添加至容器
    addToContainer(container) {
        container.element.append(this.element);
        return this.element;
    }

    text(t) {
        return this.element.text(t);
    }

    html(h) {
        if (h) {
            this.element.html(h);
            this.element.find("script").remove();
        }
        return this.element.html();
    }

    remove() {
        this.element.remove();
    }

    clear() {
        this.element.empty();
    }

    attr(key, value) {
        return this.element.attr(key, value);
    }
}

// 碎片
class Fragment extends Component {
    constructor() {
        super("div", {class: "fragment"});
    }
}

// 碎片管理器
class FragmentManager {
    constructor(container, onFragmentChange) {
        this.container = container;
        this.container.clear();
        this.count = 0;
        this.fragments = [];
        this.index = 0;
        this.callBack = onFragmentChange;
        this.container.element.css('transition', "transform 0.5s");
        this.reset();
        this.container.element.on('touchstart', e=> this.start(e));
        this.container.element.on('touchmove', e=> this.move(e));
        this.container.element.on('touchend', e=> this.end(e));
    }

    // 更新UI界面
    update() {
        this.container.element.width(this.fragments.length * 100 + "%");
        this.viewWidth = this.container.element.width() / this.fragments.length;
        this.canTurn = this.viewWidth * 0.2779;
    }

    add(fragment) {
        fragment.addToContainer(this.container).width("100%");
        this.fragments.push(fragment);
        this.update();
    }

    remove(fragment) {
        for (let i in this.fragments) {
            if (this.fragments[i] === fragment) {
                this.fragments[i].remove();
                this.fragments.slice(i, 1);
            }
        }
        this.update();
    }

    setFragment(index) {
        if (index < 0 || index >= this.fragments.length) return;
        this.index = index;
        this.container.element.css('transform', 'translate3d(-' + this.index * this.viewWidth + 'px, 0px, 0px)');
    }

    reset() {
        this.moving = false;
        status = "normal";
    }

    start(e) {
        if (status != "normal") return;
        this.startPos = input.position(e.touches[0]);
    }

    move(e) {
        if (status != "normal") return;
        const curPos = input.position(e.touches[0]);
        const dist = curPos.x - this.startPos.x;

        if (Math.abs(dist) >= this.canTurn && !this.moving) {
            status = "turning";
            this.moving = true;
            // turn here
            if ((dist < 0 && this.index + 1 < this.fragments.length) || (dist > 0 && this.index - 1 >= 0)) { 
                this.index = dist < 0 ? this.index + 1 : this.index - 1;
                this.setFragment(this.index);
                this.callBack(this.index, this.fragments[this.index]);
            }
        }
    }

    end(e) {
        this.reset();
    }
}

class DivView extends Component {
    constructor(text, props) {
        super("div", props);
        if (text[0] === "@") this.html(text.substring(1, text.length));
        else this.text(text);
    }
}

class SpanView extends Component {
    constructor(text, props) {
        super("span", props);
        if (text[0] === "@") this.html(text.substring(1, text.length));
        else this.text(text);
    }
}

class ImageView extends Component {
    constructor(props) {
        super("img", props);
    }

    setSrc(src) {
        this.attr("src", src);
    }
}

// 社团组件
class Club extends Component {
    constructor(props) {
        let id = `club-${componentID++}`;
        super("div", {
            class: "card-row",
            id: id
        });
        this.id = id;
        this.avatar = new ImageView({class: "avatar", src: props.src});
        this.clubName = new SpanView(props.clubName, {class: "name"});
        this.msgCount = new SpanView(props.msgCount, {class: "msg-count"});
        this.add(this.avatar).add(this.clubName).add(this.msgCount);
    }
}

// 活动组件
class Activity extends Component {
    constructor(props) {
        let id = `activity-${componentID++}`;
        super("div", {
            class: "card-column",
            id: id
        });
        this.id = id;
        let titleC = new DivView("", {class: "activity-title"});
        this.avatar = new ImageView({class: "avatar", src: props.src});
        this.title = new SpanView(props.title, {class: "name"});
        titleC.add(this.avatar).add(this.title);
        
        let infoC = new DivView("", {class: "activity-info"});
        this.info = new SpanView(props.info);
        infoC.add(this.info);

        this.time = new SpanView(props.time, {class: "activity-time"});
        this.add(titleC).add(infoC).add(this.time);
    }
}

class Button extends Component {
    constructor(text, props) {
        props.class = "button " + props.class;
        super('span', props);
        this.text(text);
    }
}

class UserCard extends Component {
    constructor(props) {
        super("div", {class: "card-row"});
        this.avatar = new ImageView({class: "avatar", src: props.src});
        this.userName = new SpanView(props.name, {class: "name"});
        this.add(this.avatar).add(this.userName);
    }
}

class MessageBox extends Component {
    constructor(props) {
        super("div", {class: "msg-box-panel"});
        let msgBox = new DivView("", {class: "msg-box"});
        this.msgTitle = new DivView("标题", {class: "msg-title"});
        this.msgContent = new DivView("内容栏", {class: "msg-content"});
        this.add(msgBox.add(this.msgTitle).add(this.msgContent)).element;
        this.msgPanel = this.element;
        this.hide(0);
        this.element.click(()=>this.hide(500));
    }

    init() {
        const body = $("body");
        body.prepend(this.msgPanel);
    }

    show(content, title, t) {
        this.msgPanel.width("100%");
        this.msgPanel.height("100%");
        // 计算每行最多显示的文字数量
        const maxCnt = this.msgPanel.width() * 0.75 / parseInt(this.msgContent.element.css("font-size").replace(/[^\d]+/, ""));
        // 将标题栏超过的部分用...代替
        title = title.replace(new RegExp(`(.{${parseInt(maxCnt - 3)}}).+`, "gim"), '$1...');
        // 在每一行超过的地方加入换行符
        content = content.replace(new RegExp(`([^\n]{${parseInt(maxCnt)}})`, "gim"), '$1\n');
        // 设置文本
        this.msgContent.element.text(content);
        this.msgTitle.element.text(title);
        this.msgPanel.fadeIn(t ? t : 500, ()=>this.msgPanel.show());
    }

    hide(t) {
        this.msgPanel.fadeOut(t, ()=>this.msgPanel.hide());
    }
}

const msgBox = new MessageBox();    // 如果要使用请先调用msgBox.init();


