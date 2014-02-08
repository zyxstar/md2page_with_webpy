//FullScreen
function isFullScreen(cm) {
  return /\bCodeMirror-fullscreen\b/.test(cm.getWrapperElement().className);
}
function winHeight() {
  return window.innerHeight || (document.documentElement || document.body).clientHeight;
}
function setFullScreen(cm, full) {
  var wrap = cm.getWrapperElement();
  if (full) {
    wrap.className += " CodeMirror-fullscreen";
    wrap.style.height = winHeight() + "px";
    document.documentElement.style.overflow = "hidden";
  } else {
    wrap.className = wrap.className.replace(" CodeMirror-fullscreen", "");
    wrap.style.height = "";
    document.documentElement.style.overflow = "";
  }
  cm.refresh();
}
CodeMirror.on(window, "resize", function() {
  var showing = document.body.getElementsByClassName("CodeMirror-fullscreen")[0];
  if (!showing) return;
  try{
    showing.CodeMirror.getWrapperElement().style.height = winHeight() + "px";
  }catch(e){}
});








CodeMirror.defineMode("template", function(config) {
  return CodeMirror.multiplexingMode(
    CodeMirror.getMode(config, "xml"),
    {open: "<%", close: "%>",
     mode: CodeMirror.getMode(config, "javascript"),
     delimStyle: "delimit"}
    // .. more multiplexed styles can follow here
  );
});


var editor_html = CodeMirror.fromTextArea(document.getElementById("code_html"), {
    mode: {name: "template", alignCDATA: true},
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: true,
    autoCloseTags: true,
    showCursorWhenSelecting: true,
    extraKeys: {
        "F11": function(cm) {
          setFullScreen(cm, !isFullScreen(cm));
        },
        "Esc": function(cm) {
          if (isFullScreen(cm)) setFullScreen(cm, false);
        }
      }
});
var charWidth = editor_html.defaultCharWidth(), basePadding = 4;
editor_html.on("renderLine", function(cm, line, elt) {
  var off = CodeMirror.countColumn(line.text, null, cm.getOption("tabSize")) * charWidth;
  elt.style.textIndent = "-" + off + "px";
  elt.style.paddingLeft = (basePadding + off) + "px";
});
editor_html.refresh();



var editor_css = CodeMirror.fromTextArea(document.getElementById("code_css"), {
    mode: {name: "css", alignCDATA: true},
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: true,
    autoCloseBrackets: true,
    showCursorWhenSelecting: true,
    extraKeys: {
        "F11": function(cm) {
          setFullScreen(cm, !isFullScreen(cm));
        },
        "Esc": function(cm) {
          if (isFullScreen(cm)) setFullScreen(cm, false);
        }
      }
});

window.editor_js = CodeMirror.fromTextArea(document.getElementById("code_js"), {
    mode: {name: "javascript", alignCDATA: true},
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: true,
    autoCloseBrackets: true,
    showCursorWhenSelecting: true,
    highlightSelectionMatches: true,
    extraKeys: {
        "F11": function(cm) {
          setFullScreen(cm, !isFullScreen(cm));
        },
        "Esc": function(cm) {
          if (isFullScreen(cm)) setFullScreen(cm, false);
        }
      }
});



addEvent(document.getElementById('result').getElementsByTagName('i')[0],'click',function(evt){
    var el=evt.target||evt.srcElement;
    var container=el.parentElement.parentElement;
    if(hasClass(container,'CodeMirror-fullscreen')){
        removeClass(container,'CodeMirror-fullscreen');
        removeClass(el,'full');
    }
    else{
        addClass(container,'CodeMirror-fullscreen');
        addClass(el,'full');
    }
});


Array.prototype.slice.call(document.getElementsByClassName('CodeMirror-vscrollbar')).forEach(function(el){
    el.style.display='none';
});

Array.prototype.slice.call(document.getElementsByClassName('CodeMirror-activeline-background')).forEach(function(el){
    removeClass(el,'CodeMirror-activeline-background');
});
















var horizontal_hands = Array.prototype.slice.call(document.getElementsByClassName('handler_horizontal'));
var vertical_hand=document.getElementById('handler_vertical');
var contentEl=document.getElementById('content');
var leftEl,rightEl;

Array.prototype.slice.call(document.getElementsByClassName('column')).forEach(function(el){
    if(hasClass(el,'left')) leftEl=el;
    else if(hasClass(el,'right')) rightEl=el;
});

function setContentArea(){
    contentEl.style.height=(document.documentElement.clientHeight-73)+'px';
}

addEvent(window,'resize',setContentArea);
setContentArea();

horizontal_hands.forEach(function(hand) {
    var topEl = hand.parentElement.getElementsByClassName('top')[0];
    var botEl = hand.parentElement.getElementsByClassName('bottom')[0];
    barDragger('y',hand,contentEl,topEl,botEl,
        function(el){
            el.parentElement.getElementsByClassName('shim')[0].style.display='block';
        },
        null,
        function(el){
            el.parentElement.getElementsByClassName('shim')[0].style.display='none';
        }
    );
});


barDragger('x',vertical_hand,contentEl,leftEl,rightEl,
    function(el){
        leftEl.getElementsByClassName('shim')[0].style.display='block';
        rightEl.getElementsByClassName('shim')[0].style.display='block';
    },
    null,
    function(el){
        leftEl.getElementsByClassName('shim')[0].style.display='none';
        rightEl.getElementsByClassName('shim')[0].style.display='none';
    }
);




















function run_web(){
    var ifrm_container=document.getElementById('result');
    parse_web_code(ifrm_container,editor_html.getValue(),editor_js.getValue(),editor_css.getValue());
}
document.getElementById('run').onclick=run_web;


addEvent(window,'load',function(){
    setTimeout(function(){
        if(!window.opener){
            editor_html.setValue("<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <meta charset='utf-8' \/> \n\
  <\/head>\n\
  <body>\n\
    \n\
    \n\
    \n\
  <\/body>\n\
<\/html>");
            editor_js.setValue("//import jquery.1.9.0\n");
            editor_css.setValue("@import url(/static/css/normalize.css);\n");
        }else{
            var storage=window.localStorage||window.opener.md_codeStorage;

            editor_html.setValue(storage.html);
            editor_js.setValue(HTMLDecode(storage.js));
            editor_css.setValue(storage.css);
            run_web();
        }
    },200);
});
