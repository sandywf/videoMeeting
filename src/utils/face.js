var basePath = "https://imgcdn.9itest.com";

var insertAtCaret = function (eles, myValue) {
    var me = eles;
    if (document.selection) { // IE
        me.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
        me.focus();
    } else if (me.selectionStart || me.selectionStart == '0') { // Real browsers
        var startPos = me.selectionStart, endPos = me.selectionEnd, scrollTop = me.scrollTop;
        me.value = me.value.substring(0, startPos) + myValue + me.value.substring(endPos, me.value.length);
        me.focus();
        me.selectionStart = startPos + myValue.length;
        me.selectionEnd = startPos + myValue.length;
        me.scrollTop = scrollTop;
    } else {
        me.value += myValue;
        me.focus();
    }
};

var smile = {
    emt: {
        "微笑": "weixiao",
        "呲牙": "ciya",
        "再见": "zaijian",
        "偷笑": "touxiao",
        "调皮": "tiaopi",
        "大哭": "daku",
        "擦汗": "cahan",
        "猪头": "zhutou",
        "得意": "deyi",
        "傲慢": "aoman",
        "发怒": "fanu",
        "害羞": "haixiu",
        "憨笑": "hanxiao",
        "汗": "han",
        "尴尬": "ganga",
        "抓狂": "zhuakuang",
        "花": "hua",
        "惊恐": "jingkong",
        "惊讶": "jingya",
        "可爱": "keai",
        "抠鼻": "koubi",
        "酷": "ku",
        "流泪": "liulei",
        "便便": "bianbian",
        "难过": "nanguo",
        "撇嘴": "piezui",
        "敲打": "qiaoda",
        "亲亲": "qinqin",
        "色": "se",
        "胜利": "shengli",
        "示爱": "shiai",
        "白眼": "baiyan",
        "耍酷": "shuaku",
        "衰": "shuai",
        "睡": "shui",
        "鄙视": "bishi",
        "吐": "tu",
        "嘘": "xu",
        "委屈": "weiqu",
        "炸弹": "zhadan",
        "心": "xin",
        "心裂": "xinlie",
        "菜刀": "caidao",
        "疑问": "yiwen",
        "阴险": "yinxian"
    },
    init: function (o, t, _basePath) {
        basePath = _basePath;
        smile.chatBtn = o;
        smile.chatArea = t;
        smile.box = document.createElement("div");
        var litag = '<ul>';
        for (var k in smile.emt) {
            litag += '<li><img src="' + basePath + '/face/imgs/' + smile.emt[k] + '.gif" title="' + k + '"/></li>';
        };
        litag += '</ul>';
        smile.box.id = "smileBox";
        smile.box.innerHTML = litag;
        smile.box.style.display = "none";
        document.body.appendChild(smile.box);


        let lis = smile.box.querySelectorAll('li');
        lis.forEach(element => {
            element.addEventListener("click", function () {
                var e = arguments[0] || window.event;
                var imgVal = this.children[0].title;
                insertAtCaret(smile.chatArea, smile.encodePubContent(imgVal));
                smile.box.style.display = "none";
                e.preventDefault();
                e.stopPropagation();
            })
        });

        document.body.addEventListener('click', function () {
            smile.box.style.display = "none";
        }, false)
    },
    reInit: function (o, t){
        smile.preChatArea = smile.chatArea;
        smile.chatBtn = o;
        smile.chatArea = t;
    },
    show: function () {
        var pos = smile.chatBtn.getBoundingClientRect();
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        smile.box.style.cssText = "display:block;top:" + (pos.top + scrollTop-137) + "px;left:" + (pos.left - 250) + "px;";
      
    },
    hide: function () {
        smile.box.style.display = "none";
    },
    isShow: function () {
        if (smile.box.style.display === "none") {
            return false;
        } else {
            if (smile.preChatArea) {
                if (smile.preChatArea === smile.chatArea) {
                    return true; 
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }
    },
    decodePubContent: function (content) {
        var imgReg = /\[(\W[^\[]*)\]/gim;  //匹配[酷][耶][大笑]这种格式
        if (content) {
            content = content.replace(imgReg, function (all, $1) {
                if (smile.emt[$1] === undefined) {
                    return all;
                };
                return "<img src='" + basePath + "/face/imgs/" + smile.emt[$1] + ".gif'  class='smile-icon' title='" + $1 + "' />";
            });
            return content;
        }
        return "";
    },
    encodePubContent: function (content) {
        return "[" + content + "]";
    }
};

export default smile;
