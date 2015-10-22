(function () {
    var old = console.log;
    var ifrm = document.getElementById('result').getElementsByTagName("IFRAME")[0];
    if (ifrm.contentWindow) {
      ifrm = ifrm.contentWindow;
    }
    else {
      if (ifrm.contentDocument && ifrm.contentDocument.document) {
        ifrm = ifrm.contentDocument.document;
      } else {
        ifrm = ifrm.contentDocument;
      }
    }
    var log = ifrm.document.createElement("DIV");
    ifrm.document.body.appendChild(log);
    console.log = function (message) {
        old.log(message);
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
    };
})();
