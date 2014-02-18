function alter_toc_height() {
  document.getElementById("md_toc").style.maxHeight = (document.documentElement.clientHeight - 105) + 'px';
}

function goto_top() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  var toc = document.getElementById('md_toc');
  toc.scrollTop = 0;
}

function goto_footer(){
  if (location.hash === '#footer') {
    document.body.scrollTop = document.body.scrollHeight;
    document.documentElement.scrollTop = document.body.scrollHeight;
    var toc = document.getElementById('md_toc');
    toc.scrollTop = toc.scrollHeight;
  }
}

function hide_toc() {
  document.getElementById('md_toc_wrap').style.display = 'none';
  document.getElementById('md_toc_show').style.display = 'block';
  document.getElementById('md_content').className = 'wider';
}

function show_toc() {
  document.getElementById('md_toc_wrap').style.display = 'block';
  document.getElementById('md_toc_show').style.display = 'none';
  document.getElementById('md_content').className = 'normal';
}

function change_outlink_style() {
  var arrlink = Array.prototype.slice.call(document.getElementById("md_content").getElementsByTagName("a"));
  arrlink.forEach(function(a) {
    if(a.host && a.host!==window.location.host){
      a.target="_blank";
      a.style.paddingRight='13px';
      //a.style.display='inline-block';
      a.style.marginRight='3px';
      a.style.background='url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=) center right no-repeat';
    }
  });
}

function lazyload_font() {

    var sRule1 =
        "@font-face {" +
        "  font-family: 'Hiragino Sans GB';" +
        "  src: url('/static/font/Hiragino_Sans_GB_W3.otf') format('opentype');" +
        "}";

    var style1 = document.styleSheets[0];
    if ( "function" === typeof(style1.insertRule) ) {
        // Firefox, Safari, Chrome
        style1.insertRule(sRule1, 0);
    }
    else if ( "string" === typeof(style1.cssText) ) {
        // IE
        style1.cssText = sRule1;
    }
}


(function() {

  addEvent(window, "load", function() {
    // var converter = new Markdown.Converter();
    // var html = converter.makeHtml(document.getElementById('txt_mdcontent').value);
    // document.getElementById('md_content').innerHTML = html;

    var imgs = document.getElementsByTagName('img');
    Array.prototype.slice.call(imgs).map(function(img) {
      addEvent(img, "load", function(){
        // imagebox(this);
        goto_footer();
      });
    });

    addEvent(window, "resize", alter_toc_height);
    alter_toc_height();

    var pres = document.getElementsByTagName('pre');
    Array.prototype.slice.call(pres).map(function(pre) {
      route_lang_handler(pre)();
    });

    make_toc("md_content","md_toc");

  });

  // SyntaxHighlighter.defaults['html-script'] = true;
  SyntaxHighlighter.all();

  setTimeout(function() {
    var arrDiv = Array.prototype.slice.call(document.getElementsByTagName('DIV'));
    var arrCode = arrDiv.filter(function(div) {
      return div.className.search('syntaxhighlighter') != -1
    })
    arrCode.map(function(div) {
      //if(div.scrollHeight && div.scrollHeight>=div.offsetHeight)
      div.style.pixelHeight = div.offsetHeight + 2;
      div.style.height = (div.offsetHeight + 2) + 'px';
    });

    change_outlink_style();
    // lazyload_font();
    goto_footer();




  }, 500);

})();




