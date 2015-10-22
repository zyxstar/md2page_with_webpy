(function () {
    var old = console.log;
    var logger = document.createElement("DIV");
    document.appendChild(logger);
    console.log = function (message) {
        old.log(message);
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
    };
})();
