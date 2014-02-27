function make_toc(content_el ,container_el) {
    function find_sections(el, sects) {
        for (var m = el.firstChild; m != null; m = m.nextSibling) {
            if (m.nodeType != 1) continue;
            if (m.tagName == "PRE" || m.tagName == "CODE") continue;
            if (m.tagName == "IMG" && sects.length){
                sects[sects.length-1].has_img = true;
                continue;
            }
            if (m.tagName == "P"){
                if(m.getElementsByTagName("IMG").length != 0 && sects.length)
                    sects[sects.length-1].has_img = true;
                continue;
            }
            if (m.tagName.length == 2 && m.tagName.charAt(0) == "H" && m.tagName.charAt(1) != "R")
                sects.push({
                    level: get_level(m),
                    node: m,
                    isdeal: false,
                    parent: null,
                    children: [],
                    series: [],
                    get_series: function() {
                        return this.series.join(".");
                    },
                    ref_toc_link: null,
                    has_img: false
                });
            else
                find_sections(m, sects);
        }

        function get_level(node) {
            var level = parseInt(node.tagName.charAt(1));
            if (isNaN(level) || level < 1 || level > 6) return 0;
            return level;
        }
    }

    function build_node_tree(sects) {
        var level_1_nodes = [];

        for (var i = 0; i < sects.length; i++) {
            var n = sects[i];
            if (n.isdeal) continue;
            n.children = get_children(n, i + 1);
            level_1_nodes.push(n);
        }

        //get_series
        for (var i = 0; i < level_1_nodes.length; i++) {
            level_1_nodes[i].series = [i + 1];
            get_children_series(level_1_nodes[i]);
        }

        return level_1_nodes;

        function get_children(node, start) {
            var children = [];
            for (var i = start; i < sects.length; i++) {
                var n = sects[i];
                if (n.isdeal) continue;
                if (n.level <= node.level) return children;
                else {
                    n.isdeal = true;
                    n.parent = node;
                    n.children = get_children(n, i + 1);
                    children.push(n);
                }
            }
            return children;
        }

        function get_children_series(node) {
            var children = node.children;
            for (var i = 0; i < children.length; i++) {
                var n = children[i];
                n.series = Array.prototype.slice.call(node.series);
                n.series.push(i + 1);
                get_children_series(n);
            }
        }
    }

    function create_anchor(sects) {
        for (var i = 0; i < sects.length; i++) {
            var n = sects[i];
            var sectionNumber = n.get_series();
            var section = n.node;
            // Add the section number and a space to the section header title.
            // We place the number in a <span> to make it styleable.
            var frag = document.createDocumentFragment(); // to hold span and space
            var span = document.createElement("span"); // span to hold number
            span.className = "TOCSectNum"; // make it styleable
            span.appendChild(document.createTextNode(sectionNumber)); // add sect#
            frag.appendChild(span); // Add span to fragment
            frag.appendChild(document.createTextNode(" ")); // Then add a space
            section.insertBefore(frag, section.firstChild); // Add both to header

            // Create an anchor to mark the beginning of this section.
            var anchor = document.createElement("a");
            anchor.name = "TOC" + sectionNumber; // Name the anchor so we can link
            anchor.id = "TOC" + sectionNumber; // In IE, generated anchors need ids

            // Wrap the anchor around a link back to the TOC
            // var link = document.createElement("a");
            // link.href = "#TOCtop";
            // link.className = "TOCBackLink";
            // link.appendChild(document.createTextNode("Contents"));
            // anchor.appendChild(link);

            // Insert the anchor and link immediately before the section header
            section.parentNode.insertBefore(anchor, section);
        }
    }

    function create_toc(nodes) {
        var ul = document.createElement("ul");
        ul.className = "TOCEntry";
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            var sectionNumber = n.get_series();
            var section = n.node;

            // // Now create a link to this section.
            var link = document.createElement("a");
            link.href = "#TOC" + sectionNumber; // Set link destination
            link.innerHTML = section.innerText||section.textContent; // Make link text same as heading
            if(n.has_img){
                link.appendChild(document.createElement("i"));
                addClass(link,"has-img");
            }
            link.title=section.innerText||section.textContent;
            n.ref_toc_link=link;

            var li = document.createElement("li");
            li.className = "TOCLevel_" + n.level;
            li.appendChild(link);
            if (n.children.length) {
                li.appendChild(create_toc(n.children));
                var expand = document.createElement("i");
                // expand.innerHTML="-";
                expand.className = 'expand open';
                //expand.appendChild(document.createTextNode(' '));
                //expand.href = "javascript:void(0);";
                expand.onclick = toggle_toc;
                li.insertBefore(expand, li.firstChild);
            }

            ul.appendChild(li);

        }
        return ul;
    }
    var container = (typeof container_el === "string") ? document.getElementById(container_el) : container_el;
    if (!container) return;

    var content = (typeof content_el === "string") ? document.getElementById(content_el) : content_el;
    if (!content) return;

    var sects = [];
    find_sections(content, sects);

    var level_1_nodes = build_node_tree(sects);

    create_anchor(sects);
    // container.innerHTML="";
    while(container.firstChild!=null)
        container.removeChild(container.firstChild);

    container.appendChild(create_toc(level_1_nodes));

    var cur_sect=null;
    addEvent(window, "scroll", function() {

        function add_cur_style(sect){
            addClass(sect.ref_toc_link,"current");
            for(var s=sect;s=s.parent;){
                addClass(s.ref_toc_link,"curparent");
            }
        }
        function remove_cur_style(sect){
            removeClass(sect.ref_toc_link,"current");
            for(var s=sect;s=s.parent;){
                removeClass(s.ref_toc_link,"curparent");
            }
        }

        var index = sects.length - 1;
        for (var i = 0; i < sects.length; i++) {
            var mark_sect=sects[i].node;
            var mark_sect_offsetTopInBody=offsetTopInBody(mark_sect);

            var top_distance=(document.body.scrollTop||document.documentElement.scrollTop);

            if(mark_sect_offsetTopInBody > top_distance + 50){
                index = (i==0 ? 0 : i-1);
                break;
            }
        }

        if(sects[index]!==cur_sect){
            if(cur_sect)
                remove_cur_style(cur_sect);

            cur_sect=sects[index];
            add_cur_style(cur_sect);

            var cur_link=cur_sect.ref_toc_link;
            var contRect = container.getBoundingClientRect();
            var findMeRect = cur_link.getBoundingClientRect();

            if (findMeRect.top < contRect.top || findMeRect.bottom > contRect.bottom ){
                if(cur_link.scrollIntoViewIfNeeded)
                    cur_link.scrollIntoViewIfNeeded();
                else
                    cur_link.scrollIntoView();
            }
        }

    });


}

function toggle_toc(event) {
    if (!event) event = window.event;
    var el = event.target || event.srcElement;
    var li = el.parentNode;
    if (hasClass(el, 'open')) _change_toc(li, 'close')
    else if (hasClass(el, 'close')) _change_toc(li, 'open')
}

function _change_toc(li, typ) {
    var ul = li.getElementsByTagName('UL')[0]
    if (ul) {
        ul.style.display = (typ === 'close' ? 'none' : 'block');
        var i = li.getElementsByTagName('I')[0];
        if (i) {
            removeClass(i, (typ === 'open' ? 'close' : 'open'));
            addClass(i, typ);
        }
    }
}

function expand_toc(el, level) {
    var ul = document.getElementById(el).getElementsByTagName("UL")[0];
    Array.prototype.slice.call(ul.getElementsByTagName("LI")).map(function(li) {
        if (parseInt(li.className.split('_')[1]) >= level)
            _change_toc(li, "close");
        else
            _change_toc(li, "open");
    });
    var cur_link = ul.querySelector("li a.current");
    if(!cur_link) return;
    if(cur_link.scrollIntoViewIfNeeded)
        cur_link.scrollIntoViewIfNeeded();
    else
        cur_link.scrollIntoView();
}