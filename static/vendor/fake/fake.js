
window.addEventListener('load', function(){
    var old = console.log;
    var logger = document.body;
    console.log = function() {
        var args = Array.prototype.slice.call(arguments);
        old.apply(console, args);
        if (args.length === 1){
          args = args[0];
        }
        if (typeof args == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(args) : args) + '<br />';
        } else {
            logger.innerHTML += args + '<br />';
        }
    };
}, false);

