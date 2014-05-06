//support(can combined): _em_, *em*, __strong__, **strong**, `code`, ~~del~~, [link](url), ![img alt](url "title")

function MarkdownParser(text) {

    function process(patternHandler) {
        var pattern_arr = [
            [/`(.*?)`/gm, patternHandler.handle_el("code")],

            [/\!\[(.*?)\]\((.*?)\)/gm, patternHandler.handle_img],
            [/\[(.*?)\]\((.*?)\)/gm, patternHandler.handle_link],

            [/__(.*?)__/gm, patternHandler.handle_el("strong")],
            [/_(.*?)_/gm, patternHandler.handle_el("em")],

            [/\*\*(.*?)\*\*/gm, patternHandler.handle_el("strong")],
            [/\*(.*?)\*/gm, patternHandler.handle_el("em")],

            [/~~(.*?)~~/gm, patternHandler.handle_el("del")]
        ];

        for (var i = 0; i < pattern_arr.length; i++) {
            text = text.replace(pattern_arr[i][0], pattern_arr[i][1]);
        }

        return patternHandler.builder();
    }

    function PatternHandler(parser) {
        this.handle_el = function(elnm) {
            return function() {
                var matchlen = arguments[0].length;
                var start = arguments[2];
                var content = arguments[1];
                return parser.parse_el(matchlen, start, elnm, content);
            };
        };

        this.handle_img = function() {
            var matchlen = arguments[0].length;
            var start = arguments[3];
            var alt = arguments[1];

            var src = arguments[2].split(' ')[0];
            var title = arguments[2].split(' ')[1] || "";
            title = title.replace(/\"/g, '').replace(/\'/g, '');

            return parser.parse_img(matchlen, start, alt, src, title);
        };

        this.handle_link = function() {
            var matchlen = arguments[0].length;
            var start = arguments[3];
            var content = arguments[1];
            var href = arguments[2];
            return parser.parse_link(matchlen, start, href, content);
        };

        this.builder = function() {
            return parser.builder();
        };
    }

    this.to_html = function() {
        var parser = {
            parse_el: function(matchlen, start, elnm, content) {
                if(elnm.toUpperCase()==='CODE')
                    return ["<", elnm, ">", HTMLDecode(content), "</", elnm, ">"].join("");
                else
                    return ["<", elnm, ">", new MarkdownParser(content).to_html(), "</", elnm, ">"].join("");
            },
            parse_img: function(matchlen, start, alt, src, title) {
                return ["<img src='", src, "' alt='", alt, "' title='", title, "'/>"].join("");
            },
            parse_link: function(matchlen, start, href, content) {
                return ["<a href='", href, "'>", new MarkdownParser(content).to_html(), "</a>"].join("");
            },
            builder: function() {
                return text;
            },
        };

        var hanlder = new PatternHandler(parser);
        return process(hanlder);
    };

    this.to_dom = function() {

        var frag = document.createDocumentFragment();
        var text_mark = Array.prototype.slice.call(text);
        var dom_arr = [];

        function mark_dom_arr(el, start, len) {
            Array.prototype.splice.apply(text_mark, [start, len].concat(new Array(len)));
            dom_arr[start] = el;
            return (new Array(len + 1)).join(' ');
        }

        var parser = {
            parse_el: function(matchlen, start, elnm, content) {
                var el = document.createElement(elnm.toUpperCase());
                var child = null;
                if(elnm.toUpperCase()==='CODE')
                    child = document.createTextNode(HTMLDecode(content));
                else
                    child = new MarkdownParser(content).to_dom();
                el.appendChild(child);
                return mark_dom_arr(el, start, matchlen);
            },
            parse_img: function(matchlen, start, alt, src, title) {
                var img = document.createElement("IMG");
                img.src = src;
                img.alt = alt;
                img.title = title;
                return mark_dom_arr(img, start, matchlen);
            },
            parse_link: function(matchlen, start, href, content) {
                var a = document.createElement("A");
                a.href = href;
                a.appendChild(new MarkdownParser(content).to_dom());
                return mark_dom_arr(a, start, matchlen);
            },
            builder: function() {
                for (var i = 0; i < text_mark.length; i++) {
                    if (text_mark[i]) {
                        var len = function() {
                            for (var j = i; j < text_mark.length && text_mark[j]; j++); //no loop
                            return j - i;
                        }();
                        dom_arr[i] = document.createTextNode(text_mark.slice(i, i + len).join(''));
                        i += len;
                    }
                }

                for (i = 0; i < dom_arr.length; i++) {
                    if (dom_arr[i]) {
                        frag.appendChild(dom_arr[i]);
                        delete dom_arr[i];
                    }
                }

                return frag;
            }
        };

        var hanlder = new PatternHandler(parser);
        return process(hanlder);
    };
}



// var a = "![alt](http://www.cnblogs.com/images/xml.gif dd) __test__ [_~~link~~_](http://g.cn) __good ~~and~~ `_desk_` `or` desk2__ test "

// var d = document.createElement("DIV");
// d.appendChild(new MarkdownParser(a).to_dom());
// document.documentElement.appendChild(d);