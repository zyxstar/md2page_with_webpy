function parse_js_code(win, codelines) {
  var ifrm1 = win.document.createElement('IFRAME');
  ifrm1.style.display = 'none';
  win.document.body.appendChild(ifrm1);
  if (ifrm1.contentWindow) {
    ifrm1 = ifrm1.contentWindow;
  } else {
    if (ifrm1.contentDocument && ifrm1.contentDocument.document) {
      ifrm1 = ifrm1.contentDocument.document;
    } else {
      ifrm1 = ifrm1.contentDocument;
    }
  }
  ifrm1.document.open('text/html', 'replace');
  ifrm1.document.write("<script type='text/javascript'>");
  ifrm1.document.write(codelines);
  ifrm1.document.write('<\/script>');
  ifrm1.document.close();
}

function parse_web_code(ifrm_container,html_code,js_code,css_code){

    var old_ifrm=ifrm_container.getElementsByTagName("IFRAME")[0];
    if(old_ifrm) ifrm_container.removeChild(old_ifrm);

    var ifrm=document.createElement("IFRAME");
    ifrm.frameborder='0';
    ifrm_container.appendChild(ifrm);

    if (ifrm.contentWindow) {
      ifrm = ifrm.contentWindow;
    } else {
      if (ifrm.contentDocument && ifrm.contentDocument.document) {
        ifrm = ifrm.contentDocument.document;
      } else {
        ifrm = ifrm.contentDocument;
      }
    }
    ifrm.document.open('text/html', 'replace');
    ifrm.document.write(html_code);
    ifrm.document.write("<style type='text/css'>");
    ifrm.document.write(css_code);
    ifrm.document.write('<\/style>');

    var re=/\/\/\=\s*?require\s+?(\S+)/gi;

    var matchs=[];
    js_code.replace(re,function(){
        matchs.push(arguments[1]);
        return arguments[0];
    });

    var temp="<script type='text\/javascript' src='\/static\/vendor\/$path.js'><\/script>";

    matchs.forEach(function(s){
        var idx=s.indexOf('.')==-1 ? s.length : s.indexOf('.');
        var path=[s.slice(0,idx),s.slice(idx+1),s.slice(0,idx)].filter(function(item){return item.length>0;}).join('\/');
        // temp = temp.replace(/\$res_base_url/,"//rawgithub.com/zyxstar/markdown2page/master/res");
        ifrm.document.write(temp.replace(/\$path/,path));
    });



    // ifrm.document.write("<script type='text\/javascript' src='..\/js\/common.js'><\/script>");
    ifrm.document.write("<script type='text\/javascript'>");
    ifrm.document.write("window.addEventListener('load',function(){\n");
    ifrm.document.write(js_code);
    ifrm.document.write("}, false);\n");


    ifrm.document.write('<\/script>');
    ifrm.document.close();
}




function Native_code_parser(applet_runner, lang) {
  var cfgs = [{
    lang: "python",
    file_encoding: "utf-8",
    sys_encoding: "gbk",
    firstline: "",//"# encoding: UTF-8\n",
    prompt: ">>>",
    versioncmd: "python --version",
    versionline: 1,
    filename: function(lines) {
      return "md_note.py";
    },
    parser: function(path) {
      return "python " + path;
    }
  }, {
    lang: "ruby",
    file_encoding: "utf-8",
    sys_encoding: "gbk",
    firstline: "",//"# encoding: UTF-8\n",
    prompt: ">",
    versioncmd: "ruby --version",
    versionline: 1,
    filename: function(lines) {
      return "md_note.rb";
    },
    parser: function(path) {
      // return "set RUBYOPT=-Ke -rkconv && ruby " + path;
      return "set RUBYOPT=-Ku && ruby " + path;
      // return "ruby " + path;
    }
  }, {
    lang: "csharp",
    file_encoding: "gbk",
    sys_encoding: "utf-8",
    firstline: "",
    prompt: ">",
    versioncmd: "csc -version",
    versionline: 3,
    filename: function(lines) {
      return "md_note.cs";
    },
    parser: function(path) {
      var base = path.split(".")[0];
      //return "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe /nologo /out:" + base + ".exe /target:exe " + path + " && " + base + ".exe";
      return "csc.exe /nologo /out:" + base + ".exe /target:exe " + path + " && " + base + ".exe";
    }
  }, {
    lang: "java",
    file_encoding: "utf-8",
    sys_encoding: "gbk",
    firstline: "",
    prompt: ">",
    versioncmd: "java -version",
    versionline: 3,
    filename: function(lines) {
      try{
        var match = lines.match(/public +?class +?(\w+?)\b/);
        var filename = match[1].trim();
        return filename + ".java";
      }
      catch(e){
        return "error.java";
      }
    },
    parser: function(path) {
      var lastIndex = path.lastIndexOf("\\");
      var classpath = path.slice(0, lastIndex);
      var filename = path.slice(lastIndex + 1).split('.')[0];
      return "javac " + path + " && java -classpath " + classpath + " " + filename;
    }
  }];
  var cfg = null;
  for (var i in cfgs) {
    if (cfgs[i].lang === lang) {
      cfg = cfgs[i];
      break;
    }
  }
  if (cfg === null)
    alert("This language is not yet supported on the applet running");

  this.is_ready = function(){
    if (typeof applet_runner === "undefined" ) return false;
    return typeof applet_runner.runCmd === "function";
  };

  this.get_version = function() {
    if(!this.is_ready()) return "";
    var versioninfo = applet_runner.runCmd("cmd /c " + cfg.versioncmd,cfg.sys_encoding,"UTF-8");
    return versioninfo.split('\n').slice(0, cfg.versionline).filter(function(line){return line.trim().length>0;}).join('\n')+"\n";
  };

  this.get_prompt = function() {
    return cfg.prompt;
  };

  this.exec_code = function(codelines) {
    if(!this.is_ready()) return "";
    var path = applet_runner.writeFile(cfg.filename(codelines),cfg.firstline + codelines, "UTF-8",cfg.file_encoding);
    return applet_runner.runCmd("cmd /c " + cfg.parser(path),cfg.sys_encoding,"UTF-8");
  };

  this.lang=function(){return lang;};


}
