function hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(ele, cls) {
    if (!this.hasClass(ele, cls)) ele.className += " " + cls;
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, '');
    }
}

function getArgs() {
    var args = {};
    var query = location.search.substring(1);
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        value = decodeURIComponent(value);
        args[argname] = value;
    }
    return args;
}

function HTMLDecode(text) {
    var temp = document.createElement("textarea");
    temp.innerHTML = text;
    return temp.value;
}
function HTMLEncode(text) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}
function insertAfter(existEl, newEl) {
    var nextEl = existEl.nextSibling;
    if (nextEl)
        existEl.parentElement.insertBefore(newEl, nextEl);
    else
        existEl.parentElement.appendChild(newEl);
}

function addEvent(oTarget, eventType, listener) {
    if (oTarget.addEventListener) {
        oTarget.addEventListener(eventType, listener, false);
    } else if (oTarget.attachEvent) {
        oTarget['e' + eventType + listener] = listener;
        oTarget[eventType + listener] = function() {
            oTarget['e' + eventType + listener](window.event);
        };
        oTarget.attachEvent('on' + eventType, oTarget[eventType + listener]);
    }
}

function removeEvent(oTarget, eventType, listener) {
    if (oTarget.removeEventListener) {
        oTarget.removeEventListener(eventType, listener, false);
    } else if (oTarget.detachEvent) {
        oTarget.detachEvent('on' + eventType, oTarget[eventType + listener]);
        delete oTarget[eventType + listener];
        delete oTarget['e' + eventType + listener];
    }
}



function offsetTopInBody(el) {
    var parent=el.offsetParent,
        sumOfTop=0;
    while(parent) {
        sumOfTop+=parent.offsetTop;
        parent=parent.offsetParent;
    }
    return sumOfTop+el.offsetTop;
}






if (!('trim' in String.prototype)) {
    String.prototype.trim = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}


function draggable(axis, el, startfn, dragfn, stopfn) {
    var startMPos,startElPos;

    function m_down(evt) {
        isMoving = true;
        startMPos={x:evt.clientX,y:evt.clientY};
        startElPos={top:parseFloat(el.style.top),left:parseFloat(el.style.left)};
        if (startfn) startfn(el, evt);
        addEvent(window.document, 'mousemove', m_move);
        addEvent(window.document, 'mouseup', m_up);
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }

        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
    }

    function m_move(evt) {
        var diff = {
            x: evt.clientX-startMPos.x,
            y: evt.clientY-startMPos.y
        };

        if(dragfn && dragfn(el,diff,evt) || !dragfn) {
            if (axis && axis.toLowerCase() === 'x')
                el.style.left =(startElPos.left + diff.x) + 'px';
            else if (axis && axis.toLowerCase() === 'y')
                el.style.top = (startElPos.top + diff.y) + 'px';
            else {
                el.style.left =(startElPos.left + diff.x) + 'px';
                el.style.top = (startElPos.top + diff.y) + 'px';
            }
        }
    }

    function m_up(evt) {
        isMoving = false;
        removeEvent(window.document, 'mousemove', m_move);
        removeEvent(window.document, 'mouseup', m_up);
        if (stopfn) stopfn(el, evt);
    }

    addEvent(el, 'mousedown', m_down);
}



function updateDic(oldDic,newDic) {
    for(var pro in newDic)
        if (Object.prototype.hasOwnProperty.call(newDic,pro))
            oldDic[pro] = newDic[pro];
}


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
