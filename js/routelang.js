function route_lang_handler(pre_el) {

  // check params
  // if(!pre_el) return;
  var code_el = pre_el.getElementsByTagName('code')[0];
  if(!code_el) return function(){};

  var code = code_el.innerHTML;
  var language = 'plain';
  var is_run = false;

  //extract language from comment element
  //<!-- language: !js -->
  //`!` mark if need be run
  findPreviousComment(pre_el, function(_node){
    var re = /language\s*?:\s*?(\S*?)\s*?$/gi;
    if (re.exec(_node.nodeValue).length !== 2) return;
    language = RegExp.$1.toLowerCase();
    // console.log(language);
    if (language[0] === '!') {
      is_run = true;
      language = language.slice(1);
    }else{
      findPreviousComment(_node, function(__node) {
        if(__node.nodeValue.trim() === 'run') is_run = true;
        if(__node.nodeValue.trim() === 'utils')
          get_storage().utils_code = code;
      });
    }
  });

  var trans_lang={
    'tab':'table',
    'c#':'csharp',
    'py':'python',
    'rb':'ruby',
    'erl':'erlang',
    'javascript':'js',
    'actionscript3':'as3',
    'htm':'html',
    'pl':'perl',
    'ps':'powershell'
  };
  language = trans_lang[language] || language;

  var handlers_router = {
    // extends
    'web': web_handler,
    'table': table_handler,
    'js': js_handler,
    'c': c_handler,

    // languages
    'cpp': lang_hand1er('cpp', is_run),
    'csharp': lang_hand1er('csharp', is_run),
    'python': lang_hand1er('python', is_run),
    'ruby': lang_hand1er('ruby', is_run),
    'java': lang_hand1er('java', is_run),
    'scheme': lang_hand1er('scheme', is_run),
    'assembly': lang_hand1er('assembly', is_run),
    'bash': lang_hand1er('bash', is_run),
  };
  return handlers_router[language] || default_handler();


  // define handlers

  function web_handler(){

    var num = 1;
    findPreviousNode(pre_el,
      function(_node){return _node.nodeName.toUpperCase()[0] === 'H';},
      function(_node){
        num = _node.nodeName[1]-(-1);
      });

    function _add_pre(lang,code){
      var head=document.createElement('H'+num);
      head.appendChild(document.createTextNode(lang+' Code'));

      var pre=document.createElement('PRE');
      pre.className = 'brush: ' + lang.toLowerCase() + ';';
      pre.innerHTML = code;

      pre_el.parentElement.insertBefore(head,pre_el);
      pre_el.parentElement.insertBefore(pre,pre_el);
    }

    code = HTMLDecode(code);
    var webCodes={html:'',js:'',css:''};
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
          _add_pre('Html',HTMLEncode(_cd));
          break;
        case 'css':
          webCodes.css=_cd;
          _add_pre('Css',_cd);
          break;
        case 'javascript':
        case 'js':
          webCodes.js=_cd;
          _add_pre('JavaScript',_cd);
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

  function js_handler(){
    lang_hand1er('js',is_run, function(code){
      return {js: code, html: '', css: ''};
    })();
  }

  function c_handler(){
    var utils_code = get_storage().utils_code;

    function get_fun_code(fun_nm){
      var re = new RegExp('/\/\ '+ fun_nm + '(.|[\\r\\n])*?[\\r\\n]}', 'i');
      return re.exec(utils_code)[0];
    }

    lang_hand1er('c',is_run,function(code){
      if(typeof utils_code === 'string'){

        var re=/\/\/\=\s*?require\s+?(\S+)/gi;
        code = code.replace(re,function(){
            var fun_nm = arguments[1];
            return get_fun_code(fun_nm);
        });

      }
      return {lang: 'c', code: code};
    })();
  }

  function lang_hand1er(lang, is_run, setStorage_fn) {
    return function() {
      pre_el.className = 'brush: ' + lang + ';';
      pre_el.innerHTML = code;
      var storage_values = {lang:lang,code:code};
      if(setStorage_fn)
        storage_values = setStorage_fn(code);
      if (is_run)
        create_run(pre_el, lang, storage_values);
    };
  }

  function default_handler(){
    var langs = ['as3','css','delphi','erlang','groovy','html','pascal','perl','php','powershell','scala','shell','sql','xml'];

    var cur_lang = langs.filter(function(_lang){return _lang===language;})[0] || 'plain';
    return lang_hand1er(cur_lang);
  }
}


//在以本地文件打开时，window.open(url)后的子窗口由于权限问题，父子间不能通信
//而以网络方式打开时则可以访问
//以window.open(')的方式，由代码生成子窗口，则没有权限受限

function create_run(pre, lang, storage_values) {
  var width=screen.availWidth*0.8;
  var height=screen.availHeight*0.8;

  if (lang === 'js') {
    create_run_button(pre,'web',storage_values,width,height);
  }
  else if(lang==='web'){
    create_run_button(pre,'web',storage_values,width,height);
  }
  else{
    width = screen.availWidth*0.4;
    // 只能使用url? 不能使用url# 否则打开新页面不会刷新
    create_run_button(pre,'lang?online',storage_values,width,height);
  }
}


function create_run_button(pre, page, storage_values, width, height){
  // function setStorage(values){
  //   window.md_codeStorage=values;
  //   if(window.localStorage)
  //     updateDic(window.localStorage,window.md_codeStorage);
  // }
  var btn = document.createElement('input');
  btn.type = 'button';
  btn.value = '►';
  btn.onclick = function() {
    updateDic(get_storage(), storage_values);
    window.open('/popup/'+page, page, 'top=1,left=1,height='+height+',width='+width+',status=yes,toolbar=no,menubar=no,location=no,resizable=yes');
  };
  insertAfter(pre, btn);
}


