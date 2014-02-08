//#table
//|              | 类型        | 直接量声明       | 包装对象 |
//|-------------:|-------------|:-----------------|:--------:|
//| **基本类型** | *undefined* | `v=undefined`    | ~~无~~   |
//| **基本类型** | *string*    | `v='..';v=".."`  | String   |
//| **基本类型** | _number_    | `v=1234 `        | Number   |
//| **基本类型** | _boolean_   | `v=true;v=false` | Boolean  |
//| **基本类型** | _function_  | `v=function(){}` | Function |
//| __对象__     | _object_    | `v={..};v=null`  | Object   |
//| __对象__     | _regex_     | `v=/.../..`      | RegExp   |
//| __对象__     | _array_     | `v=[...]`        | [__Array__](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)    |

function parse_table(text) {
    var lines = text.split('\n').slice(0, -1).map(function(line) {
        return line
            .split('|')
            .slice(1, -1)
            .map(Function.prototype.call, String.prototype.trim);
            //.map(Function.prototype.call.bind(String.prototype.trim));
    });

    var heads = lines[0];
    var aligns = lines[1].map(function(item) {
        if (item[0] === ":" && item.slice(-1) === ":")
            return "center";
        if (item[0] === ":")
            return "left";
        if (item.slice(-1) === ":")
            return "right";
    });

    var frag = document.createDocumentFragment();
    var table = document.createElement("TABLE");
    frag.appendChild(table);

    var thead = document.createElement("THEAD");
    table.appendChild(thead);

    var tr = document.createElement("TR");
    thead.appendChild(tr);

    heads.map(function(item, idx) {
        var th = document.createElement("TH");
        if (aligns[idx])
            th.align = aligns[idx];
        th.appendChild(document.createTextNode(item));
        tr.appendChild(th);
    });

    var tbody = document.createElement("TBODY");
    table.appendChild(tbody);

    for (var row = 2; row < lines.length; row++) {
        var tr = document.createElement("TR");
        tbody.appendChild(tr);
        for (var col = 0; col < heads.length; col++) {
            var td = document.createElement("TD");
            if (aligns[col])
                td.align = aligns[col];
            // var converter = new Markdown.Converter();
            // td.innerHTML = converter.makeHtml(lines[row][col]);
            td.appendChild(new MarkdownParser(lines[row][col]).to_dom());
            // td.innerHTML=new Markdown(lines[row][col]).to_html();
            tr.appendChild(td);
        }
    }
    return frag;
}

