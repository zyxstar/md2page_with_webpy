function imagebox(img) {
    var img_el = (typeof img === "string") ? document.getElementById(img) : img;
    if (!img_el) return;

    var s = img_el.src;
    var w = img_el.width;
    var h = img_el.height;

    addClass(img_el, "img-box");
    addEvent(img_el, "click", function(){
        show_overlay();
        show_img(s,w,h);
    });
}

function hide_img(){
    document.querySelector(".img-show").style.display='none';
    document.querySelector(".img-overlay").style.display='none';
}

function show_img(src, width, height){
    var div = document.querySelector(".img-show");
    var img = null;
    if(!div){
        div = document.createElement("DIV");
        addClass(div,"img-show");

        img = document.createElement("IMG");
        div.appendChild(img);

        hide = document.createElement("I");
        addClass(hide, "img-close");
        addEvent(hide, "click", hide_img);

        div.appendChild(hide);

        document.body.insertBefore(div,document.body.children[1]);
    }
    if(!img) img = div.querySelector("img");
    img.src = src;
    img.width=width;
    img.height=height;

    div.style.width = width+"px";
    div.style.height = height+"px";
    div.style.marginTop = (-(height/2)) + "px"
    div.style.marginLeft = (-(width/2)) + "px"
    div.style.display = "block";

}

function show_overlay(){
    var overlay = document.querySelector(".img-overlay");
    if(!overlay){
        overlay = document.createElement("DIV");
        addClass(overlay,"img-overlay");
        addEvent(overlay,"click",hide_img);
        document.body.insertBefore(overlay,document.body.children[0]);
    }

    overlay.style.display = "block";
    overlay.style.height = document.body.scrollHeight + "px";
}