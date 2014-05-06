function alter_toc_height() {
  document.getElementById('md_toc').style.maxHeight = (document.documentElement.clientHeight - 105) + 'px';
}

function goto_top() {
  document.documentElement.scrollTop = 0;
  // if(document.documentElement.scrollTop !== +document.documentElement.scrollTop)
  document.body.scrollTop = 0;

  var toc = document.getElementById('md_toc');
  toc.scrollTop = 0;
}

function check_goto_footer(){
  if (location.hash === '#footer') {
    document.documentElement.scrollTop = document.body.scrollHeight;
    // if(document.documentElement.scrollTop !== +document.documentElement.scrollTop)
    document.body.scrollTop = document.body.scrollHeight;
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

function change_external_link_style() {
  var arrlink = Array.prototype.slice.call(document.getElementById('md_content').getElementsByTagName('a'));
  arrlink.forEach(function(a) {
    if(a.host && a.host!==window.location.host){
      a.target='_blank';
      addClass(a,'external');
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
    if ('function' === typeof(style1.insertRule) ) {
        // Firefox, Safari, Chrome
        style1.insertRule(sRule1, 0);
    }
    else if ('string' === typeof(style1.cssText) ) {
        // IE
        style1.cssText = sRule1;
    }
}

function render_author_date(){
    var el = document.getElementById('md_content').firstElementChild;
    if(el && el.tagName == 'BLOCKQUOTE')
        addClass(el,'author-date');
}



$(document).ready(function(){
    $(window).on('resize', _.throttle(alter_toc_height, 100));

    // $('#md_content img').on('load', function(){
    //     imagebox(this);
    //     check_goto_footer();
    // });

    $('#md_content img').each(function(){
       $(this).attr({'data-original':$(this).attr('src')})
              .attr('src', '/static/css/imgs/lazy.png')
              .addClass('lazy');
    });

    $('#md_content img.lazy').lazyload({threshold : 200, effect : 'fadeIn'});
    $('#md_content pre').each(function(){route_lang_handler(this)();});

    SyntaxHighlighter.highlight();
    render_author_date();
    make_toc('md_content','md_toc');
    expand_toc('md_toc',3);
    alter_toc_height();

    $('#md_content div.syntaxhighlighter').each(function(){
        this.style.pixelHeight = this.offsetHeight + 2;
        this.style.height = (this.offsetHeight + 2) + 'px';
    });

    change_external_link_style();
    //lazyload_font();
    check_goto_footer();
});







