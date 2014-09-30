function route_lang_handler(pre_el) {

  if(!pre_el) return;
  var code_el = pre_el.getElementsByTagName('code')[0];
  if(!code_el) return;

  var code = code_el.innerHTML;
  var language = "plain";
  var needrun = false;

  //<!-- language: !js -->
  //`!` mark if need be run
  for (var prev = pre_el.previousSibling; prev !== null; prev = prev.previousSibling) {
    if (prev.nodeType === 3) continue; //text
    if (prev.nodeType === 8) { //comment
      var re = /language\s*?:\s*?(\S*?)\s*?$/gi;
      if (re.exec(prev.nodeValue).length==2) {
        language = RegExp.$1.toLowerCase();
        if (language[0] === '!') {
          needrun = true;
          language = language.slice(1);
        }
      }
    }
    break;
  }

  function web_handler(){

    var num=1;
    for (var prev = pre_el.previousSibling; prev !== null; prev = prev.previousSibling) {
      if (prev.nodeName.toUpperCase()[0] === 'H'){
        num=prev.nodeName[1]-(-1);
        break;
      }
    }

    function add_pre(lang,code){
      var head=document.createElement('H'+num);
      head.appendChild(document.createTextNode(lang+" Code"));

      var pre=document.createElement('PRE');
      pre.className = "brush: " + lang.toLowerCase() + ";";
      pre.innerHTML = code;

      pre_el.parentElement.insertBefore(head,pre_el);
      pre_el.parentElement.insertBefore(pre,pre_el);
    }
    code=HTMLDecode(code);
    var webCodes={html:"",js:"",css:""};
    var re=/<!--\s*?language\s*?:\s*?!?(\S*?)\s*?-->/gi;
    var descs=[];
    code.replace(re,function(){
        descs.push({lang:arguments[1].toLowerCase(),idx:arguments[2],len:arguments[0].length});
    });

    for(var i=0;i<descs.length;i++){
      var _cd=code.slice(descs[i].idx+descs[i].len, i<descs.length-1 ? descs[i+1].idx : code.length).trim();

      switch(descs[i].lang){
        case 'html':
        case 'htm':
          webCodes.html=_cd;
          add_pre("Html",HTMLEncode(_cd));
          break;
        case 'css':
          webCodes.css=_cd;
          add_pre("Css",_cd);
          break;
        case 'javascript':
        case 'js':
          webCodes.js=_cd;
          add_pre("JavaScript",_cd);
          break;
        default:break;
      }
    }

    create_run(pre_el, language, webCodes);
    pre_el.parentElement.removeChild(pre_el);
  }

  function table_handler() {
    insertAfter(pre_el, parse_table(code));
    pre_el.parentElement.removeChild(pre_el);
  }

  function lang_hand1er(lang, brush, is_run_applet, is_run_online) {
    return function() {
      pre_el.className = "brush: " + brush + ";";
      pre_el.innerHTML = code;
      if (needrun)
        create_run(pre_el, lang, code, is_run_applet, is_run_online);
    };
  }

  var trans_lang={
    "tab":"table",
    "c#":"csharp",
    "py":"python",
    "rb":"ruby",
    "erl":"erlang",
    "javascript":"js",
    "actionscript3":"as3",
    "htm":"html",
    "pl":"perl",
    "ps":"powershell"
  };

  language = trans_lang[language] || language;

  var extend_handlers = {
    "web": web_handler,
    "table": table_handler,
    "c": lang_hand1er("c","c",false,true),
    "cpp": lang_hand1er("cpp","cpp",false,true),
    "csharp": lang_hand1er("csharp","csharp",true,true),
    "python": lang_hand1er("python","python",true,true),
    "ruby": lang_hand1er("ruby","ruby",true,true),
    "js": lang_hand1er("js","js",false,false),
    "java": lang_hand1er("java","java",true,true),
    "scheme": lang_hand1er("scheme","scheme",false,true),
    "bash": lang_hand1er("bash","bash",false,true),
  };

  var default_handlers = function(){
    var langs = ["as3","css","delphi","erlang","groovy","html","pascal","perl","php","powershell","scala","shell","sql","xml"];
    var cur_lang = langs.filter(function(_lang){return _lang===language;})[0] || 'plain';
    return lang_hand1er(cur_lang, cur_lang, false, false);
  };
  return extend_handlers[language] || default_handlers();
}




//在以本地文件打开时，window.open(url)后的子窗口由于权限问题，父子间不能通信
//而以网络方式打开时则可以访问
//以window.open("")的方式，由代码生成子窗口，则没有权限受限

function create_run(pre, lang, code, is_run_applet, is_run_online)  {

  var width=screen.availWidth*0.8;
  var height=screen.availHeight*0.8;

  if (lang === "js") {
    create_run_button(pre,"►",'web',width,height,{html:"",js:code,css:""});
  }
  else if(lang==='web'){
    create_run_button(pre,"►",'web',width,height,code);
  }
  else{
    width = screen.availWidth*0.4;
    // if(is_run_applet)
      // create_run_button(pre,"►applet",'lang',width,height,{lang:lang,code:code});
      //只能使用url? 不能使用url# 否则打开新页面不会刷新
    if(is_run_online)
      create_run_button(pre,"►",'lang?online',width,height,{lang:lang,code:code});
  }

}


function create_run_button(pre, btn_name, page, width, height, storage_values){

  function setStorage(values){
    window.md_codeStorage=values;
    if(window.localStorage)
      updateDic(window.localStorage,window.md_codeStorage);
  }

  var btn = document.createElement('input');
  btn.type = 'button';
  btn.value = btn_name;
  btn.onclick = function() {
    setStorage(storage_values);
    window.open('/popup/'+page, page, 'top=1,left=1,height='+height+',width='+width+',status=yes,toolbar=no,menubar=no,location=no,resizable=yes');
  };
  insertAfter(pre, btn);
}


