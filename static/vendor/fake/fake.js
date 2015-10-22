
window.addEventListener('load', function(){
    var old = console.log;
    var logger = document.body;
    console.log = function(message) {
        old.apply(console, Array.prototype.slice.call(arguments));
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
    };
}, false);

