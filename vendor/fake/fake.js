
(function(){
    var old_log = console.log;
    var memo = [];

    console.log = function() {
        var args = Array.prototype.slice.call(arguments);
        old_log.apply(console, args);
        if (args.length === 1){
            args = args[0];
        }
        if (typeof args == 'object') {
            memo.push((JSON && JSON.stringify ? JSON.stringify(args) : args) + '<br />');
        } else {
            memo.push(args + '<br />');
        }

        retry_run(function(){
            return get_logger();
        }, function(){
            while(memo.length)
                get_logger().innerHTML += memo.splice(0,1)[0];
        });
    };

    function get_logger(){
        return document.getElementById('logger');
    }

    function create_logger(){
        var logger = document.createElement('DIV');
        logger.id = 'logger';
        document.body.appendChild(logger);
    }

    window.addEventListener('load', create_logger, false);

})();


function retry_run(fn_util_cond, fn_run_body, times, interval) {
    var _times = times || 5;
    var _interval = interval || 500;
    (function () {
        if (fn_util_cond()) {
            fn_run_body();
        } else if (_times > 0) {
            _times--;
            setTimeout(arguments.callee, _interval);
        }
    })();
}



