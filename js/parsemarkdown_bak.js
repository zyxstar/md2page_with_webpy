
//support(can combined): _em_, *em*, __strong__, **strong**, `code`, ~~del~~, [link](url), ![img alt](url "title")
function markdown2html(text) {
    function trans2el(el) {
        return function() {
            return ["<", el, ">",markdown2html(arguments[1]),"</", el, ">"].join("");
        }
    }

    function trans2img() {
        var arr=arguments[2].split(' ');
        var src=arr[0];
        var title= arr[1] || "";
        title=title.replace(/\"/g,'').replace(/\'/g,'');
        return ["<img src='",src,"' alt='",arguments[1],"' title='",title ,"'/>"].join("");
    }

    function trans2link() {
        return ["<a href='",arguments[2],"'>",markdown2html(arguments[1]),"</a>"].join("");
    }

    var pattern_arr = [
        [/\!\[(.*?)\]\((.*?)\)/gm, trans2img],
        [/\[(.*?)\]\((.*?)\)/gm, trans2link],

        [/__(.*?)__/gm, trans2el("strong")],
        [/_(.*?)_/gm, trans2el("em")],

        [/\*\*(.*?)\*\*/gm, trans2el("strong")],
        [/\*(.*?)\*/gm, trans2el("em")],

        [/`(.*?)`/gm, trans2el("code")],
        [/~~(.*?)~~/gm, trans2el("del")]

    ];

    for (var i = 0; i < pattern_arr.length; i++) {
        text = text.replace(pattern_arr[i][0], pattern_arr[i][1]);
    }

    return text;
}




function markdown2dom(text) {
    var frag = document.createDocumentFragment();
    var text_mark = Array.prototype.slice.call(text);
    var dom_arr = [];

    function mark_dom_arr(el, start, len) {
        Array.prototype.splice.apply(text_mark, [start, len].concat(new Array(len)));
        dom_arr[start] = el;
        return (new Array(len + 1)).join(' ');
    }

    function trans2el(el_nm) {
        return function() {
            var matchwhole = arguments[0];
            var len = matchwhole.length;
            var start = arguments[2];

            var matchword = arguments[1];

            var el = document.createElement(el_nm.toUpperCase());
            var child = markdown2dom(matchword);
            el.appendChild(child);
            return mark_dom_arr(el, start, len);
        };
    }

    function trans2img() {
        var matchwhole = arguments[0];
        var len = matchwhole.length;
        var start = arguments[3];

        var alt = arguments[1];
        var src = arguments[2].split(' ')[0];
        var title = arguments[2].split(' ')[1] || "";
        title = title.replace(/\"/g, '').replace(/\'/g, '');

        var img = document.createElement("IMG");
        img.src = src;
        img.alt = alt;
        img.title = title;

        return mark_dom_arr(img, start, len);
    }

    function trans2link() {
        var matchwhole = arguments[0];
        var len = matchwhole.length;
        var start = arguments[3];

        var content = arguments[1];
        var href = arguments[2];

        var a = document.createElement("A");
        a.href = href;
        a.appendChild(markdown2dom(content));

        return mark_dom_arr(a, start, len);
    }

    var pattern_arr = [
        [/\!\[(.*?)\]\((.*?)\)/gm, trans2img],
        [/\[(.*?)\]\((.*?)\)/gm, trans2link],

        [/__(.*?)__/gm, trans2el("strong")],
        [/_(.*?)_/gm, trans2el("em")],

        [/\*\*(.*?)\*\*/gm, trans2el("strong")],
        [/\*(.*?)\*/gm, trans2el("em")],

        [/`(.*?)`/gm, trans2el("code")],
        [/~~(.*?)~~/gm, trans2el("del")]
    ];

    for (var i = 0; i < pattern_arr.length; i++) {
        text = text.replace(pattern_arr[i][0], pattern_arr[i][1]);
    }

    for (var i = 0; i < text_mark.length; i++) {
        if (text_mark[i]) {
            var len = function() {
                for (var j = i; j < text_mark.length && text_mark[j]; j++); //no loop
                return j - i;
            }();
            dom_arr[i] = document.createTextNode(text_mark.slice(i, i + len).join(''))
            i += len;
        }
    }

    for (var i = 0; i < dom_arr.length; i++) {
        if (dom_arr[i]) {
            frag.appendChild(dom_arr[i]);
            delete dom_arr[i];
        }
    }

    return frag;
}

// var a = "![alt](http://www.cnblogs.com/images/xml.gif dd) __test__ [_~~link~~_](http://g.cn) __good ~~and~~ `_desk_` `or` desk2__ test "

// var d = document.createElement("DIV");
// d.appendChild(markdown2dom(a));
// document.documentElement.appendChild(d);