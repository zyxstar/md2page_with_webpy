function barDragger(axis,barEl,contentEl,firstEl,lastEl,startfn,dragfn,stopfn){
    var PRO_WH = (axis==='x') ? 'width' : 'height';
    var PRO_LT = (axis==='x') ? 'left' : 'top';
    var HALF_BAR_WIDTH = (axis==='x') ? barEl.clientWidth/2.0 : barEl.clientHeight/2.0;
    var MIN_LEN_LIMIT=100.0+HALF_BAR_WIDTH;
    var contentMeasure =function(){
        return (axis==='x') ? contentEl.clientWidth : contentEl.clientHeight;
    };

    var firstPercent;

    function initContent(){
        barEl.style[PRO_LT]=(contentMeasure()/2-HALF_BAR_WIDTH)+'px';
        adjustContent(contentMeasure()/2);
    }
    addEvent(window,'load',initContent);

    function resizeContent(){
        var _firstPercent = firstEl.style[PRO_WH].replace('%', '');
        var _firstMeasure = contentMeasure()*_firstPercent/100;

        barEl.style[PRO_LT]=(_firstMeasure-HALF_BAR_WIDTH)+'px';
        adjustContent(_firstMeasure);
    }
    addEvent(window,'resize',resizeContent);

    function adjustContent(firstMeasure){
        var _firstPercent=firstMeasure/contentMeasure()*100;
        firstEl.style[PRO_WH]=_firstPercent+'%';
        lastEl.style[PRO_WH]=(100-_firstPercent)+'%';
    }

    function _startfn(el,evt){
        firstPercent = firstEl.style[PRO_WH].replace('%', '')||50;

        if(startfn) startfn(el,evt);
    }

    function _dragfn(el,diff,evt){
        // var _elPos=parseFloat(el.style[PRO_LT]);
        // if(_elPos<MIN_LEN_LIMIT- HALF_BAR_WIDTH  || _elPos>(contentMeasure()-MIN_LEN_LIMIT-HALF_BAR_WIDTH ))
        //     return false;

        var _firstMeasure=(contentMeasure()*firstPercent)/100 + diff[axis];

        adjustContent(_firstMeasure);

        if(dragfn) dragfn(el,diff,evt);
        return true;
    }

    function _stopfn(el,evt){
        var _elPos=parseFloat(el.style[PRO_LT]);
        if(_elPos<MIN_LEN_LIMIT-HALF_BAR_WIDTH ){
            el.style[PRO_LT]=(MIN_LEN_LIMIT-HALF_BAR_WIDTH)+'px';
            adjustContent(MIN_LEN_LIMIT);
        }
        else if(_elPos>(contentMeasure()-MIN_LEN_LIMIT-HALF_BAR_WIDTH)){
            el.style[PRO_LT]=(contentMeasure()-MIN_LEN_LIMIT-HALF_BAR_WIDTH)+'px';
            adjustContent(contentMeasure()-MIN_LEN_LIMIT);
        }
        if(stopfn) stopfn(el,evt);
    }

    draggable(axis,barEl,_startfn,_dragfn,_stopfn);
}


