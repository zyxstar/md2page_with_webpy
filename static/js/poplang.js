var horizontal_hands = Array.prototype.slice.call(document.getElementsByClassName('handler_horizontal'));
var contentEl=document.getElementById('content');

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




















var code_parser, code_editor;

function get_lang_cfgs(){
    return [
        {lang:'python',lang_alias:'python', modename:'text/x-python', exec_type:'execute'},
        {lang:'ruby', lang_alias:'ruby', modename:'text/x-ruby', exec_type:'execute'},
        {lang:'c', lang_alias:'c', modename:'text/x-csrc', exec_type:'compile'},
        {lang:'cpp', lang_alias:'cpp', modename:'text/x-c++src', exec_type:'compile'},
        {lang:'csharp', lang_alias:'csharp', modename:'text/x-csharp', exec_type:'compile'},
        {lang:'java', lang_alias:'java', modename:'text/x-java', exec_type:'compile'},
        {lang:'scheme', lang_alias:'scheme', modename:'text/x-scheme', exec_type:'execute'},
        {lang:'bash', lang_alias:'bash', modename:'text/x-sh', exec_type:'execute'},
        // {lang:'objective-c', lang_alias:'objc', modename:'text/x-csrc', exec_type:'compile'},
        // {lang:'golang', lang_alias:'golang', modename:'text/x-go', exec_type:'execute'},
    ];
}


function init_page(){
    var is_online=location.search.match(/online/i);

    //init select
    var sel_lang=document.getElementById("sel_lang");
    var lang_cfgs=get_lang_cfgs();
    for(var i in lang_cfgs){
        var option=document.createElement("OPTION");
        option.appendChild(document.createTextNode(lang_cfgs[i].lang));
        option.value=lang_cfgs[i].lang;
        sel_lang.appendChild(option);
    }

    //init editor
    code_editor = CodeMirror.fromTextArea(document.getElementById("txt_code"), {
        mode: lang_cfgs[0].modename,
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true,
        highlightSelectionMatches: true,
        showCursorWhenSelecting: true
    });

    change_online(is_online);
}


function change_online(is_online){
    if(is_online){
        document.getElementById("chk_online").checked=true;
        document.getElementById("txt_result").style.display='none';
        document.getElementById("ifr_result").style.display='block';
    } else {
        document.getElementById("chk_online").checked=false;
        document.getElementById("txt_result").style.display='block';
        document.getElementById("ifr_result").style.display='none';
        create_cmdRunner();
    }
}


function change_lang(lang){
    var is_online=document.getElementById("chk_online").checked;
    if(!is_online && (!code_parser || code_parser.lang!==lang)){
        var runner = document.getElementById('cmdRunner');
        code_parser = new Native_code_parser(runner,lang);

        retry_run(code_parser.is_ready, function(){
            document.getElementById('txt_result').value = code_parser.get_version();
        }, 60, 1000);

    }

    var langmode = get_lang_cfgs().filter(function(cfg){return cfg.lang===lang;})[0].modename;
    code_editor.setOption("mode",langmode);
}


function create_cmdRunner(){
    if(document.getElementById('cmdRunner')) return;
    var app = document.createElement('applet');
    app.id= 'cmdRunner';
    app.archive= '/static/applet/CmdRunner.jar';
    app.code= 'CmdRunner.class';
    app.codebase='.';
    app.width = '0';
    app.height = '0';
    document.getElementById('runnerContainer').appendChild(app);
}


function run_lang(){
    var is_online=document.getElementById("chk_online").checked;
    var lang=document.getElementById("sel_lang").value;
    var code=code_editor.getValue();

    if(is_online){
        var frm_online=document.forms['frm_online'];
        lang_cfg = get_lang_cfgs().filter(function(cfg){return cfg.lang===lang;})[0];
        frm_online.lang.value=lang;
        frm_online.lang_alias.value=lang_cfg.lang_alias;
        frm_online.code.value=code;
        frm_online.exec_type.value=lang_cfg.exec_type;
        frm_online.submit();
    } else{
        var txt_result = document.getElementById('txt_result');
        retry_run(code_parser.is_ready, function(){
            var result = code_parser.exec_code(code);
            txt_result.value += code_parser.get_prompt()+' '+result;
            txt_result.scrollTop = txt_result.scrollHeight;
        }, 60, 1000);
    }
}


addEvent(window,'load',function(){
    init_page();

    if(window.opener){
        var storage=window.localStorage||window.opener.md_codeStorage;
        var lang=storage.lang;
        var code=storage.code;

        document.getElementById('sel_lang').value=lang;
        change_lang(lang);
        code_editor.setValue(HTMLDecode(code));

        run_lang();
    }
    else
        change_lang(get_lang_cfgs()[0].lang);

    addEvent(document.getElementById('run'),'click',run_lang);
    addEvent(document.getElementById("chk_online"),'click',function(){
        change_online(document.getElementById("chk_online").checked);
        change_lang(document.getElementById("sel_lang").value);
    });
    addEvent(document.getElementById("sel_lang"),'change',function(){
        change_lang(document.getElementById("sel_lang").value);
    });

});

