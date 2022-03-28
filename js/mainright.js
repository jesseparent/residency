// This file uses the Main.js v1.1 template dated 2020-3-10

// Define the trigger mapping for this sim
var triggerMap = {
    "r01": { nextView: "r02", triggerID: "deploy" },
    "r02": { nextView: "r03", triggerID: "network-performance" },
    "r03": { nextView: "r04", triggerID: "virtualization" },
    "r04": { nextView: "r05", triggerID: "streamline" },
    "r05": { }
};

// set the zooming strategy for this content to match the container in which it will be displayed
function setZoom() {
    //   zoomStrategy Options List:
    //   1 = mobile, scaled to width-only at 375px
    //   2 = iframe right 2/3, 2350px wide by 1920px tall, zoomed to min of both H and V to avoid cropping.
    //   3 = iframe 1/3, 1124px wide by 1920px tall, zoomed to height-only
    var zoomStrategy = 4;

    if (zoomStrategy === 1) {
        // #1 mobile style
        document.body.style.zoom = window.innerWidth / 375;
    } else if (zoomStrategy === 2) {
        // #2 right2/3 iframe style
        var zoom4width = window.innerWidth / 2350;
        var zoom4height = window.innerHeight / 1920;
        document.body.style.zoom = Math.min(zoom4width, zoom4height);
        document.body.style['-o-transform'] = 'scale(' + Math.min(zoom4width, zoom4height) + ')';
        document.body.style['-moz-transform'] = 'scale(' + Math.min(zoom4width, zoom4height) + ')';

        // document.body.style.transform = 'scale(' + Math.min(zoom4width,zoom4height) + ')';        
        // document.body.style['-webkit-transform'] = 'scale(' + Math.min(zoom4width,zoom4height) + ')';
        // console.log('window.innerWidth: ' + window.innerWidth);
        // console.log('window.innerHeight: ' + window.innerHeight);
        // console.log('Math.min(zoom4width,zoom4height): ' + Math.min(zoom4width,zoom4height));
        // console.log('document.body.style.zoom: ' + document.body.style.zoom);        
    } else if (zoomStrategy === 3) {
        // #3 1/3 iframe style
        var zoom4height = window.innerHeight / 1920;
    } else if (zoomStrategy === 4) {
        // #4 1/3 iframe style zoomed to smallest of width or height
        var zoom4width = window.innerWidth / 1124;
        var zoom4height = window.innerHeight / 1920;
        zoomValue = Math.min(zoom4width, zoom4height);
        
        if (document.createElement("detect").style.zoom === "") {
            // console.log("zoom");
            document.body.style.zoom = zoomValue;
            // console.log(document.body.style.zoom);
        }
        else{
            // console.log("no zoom");
            document.body.style.transform = `scale(${zoomValue})`;
            document.body.style.transformOrigin = '0 0';
            // console.log(document.body.style.transform);
            // console.log(document.body.style.transformOrigin)
        }        
    }
};

// ###########################################################################################################################
// #######                    Values below this line should not need editing for typical sim usage                     #######
// ###########################################################################################################################

function tooltip() {
    let $tooltip = document.querySelector('[data-tooltip]');

    if ($tooltip) {
        let tooltipRect = $tooltip.getBoundingClientRect();
        let tooltip = {
            tooltipRect,
            zoom: /firefox/i.test(navigator.userAgent) ? 1 : parseFloat(document.body.style.zoom),
            //zoom: parseFloat(document.body.style.zoom),
            content: $tooltip.dataset.content,
            // 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left'
            // 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top'
            placement: $tooltip.dataset.tooltip || 'top',
        };
        window.parent.postMessage({ setTooltip: { tooltip } }, '*');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(tooltip, 1000);
});

// Enable arrow key command escape from iframe
window.addEventListener('keyup', e => {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
        e.preventDefault();
        window.parent.postMessage({ refocus: { keyCode: e.keyCode } }, '*');
    } else if(e.keyCode == 13){
        stepper();
    }
})

// ANIMA functions
anima_isHidden = function (e) {
    if (!(e instanceof HTMLElement)) return !1;
    if (getComputedStyle(e).display == "none") return !0; else if (e.parentNode && anima_isHidden(e.parentNode)) return !0;
    return !1;
};
anima_loadAsyncSrcForTag = function (tag) {
    var elements = document.getElementsByTagName(tag);
    var toLoad = [];
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i];
        var src = e.getAttribute("src");
        var loaded = (src != undefined && src.length > 0 && src != 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
        if (loaded) continue;
        var asyncSrc = e.getAttribute("anima-src");
        if (asyncSrc == undefined || asyncSrc.length == 0) continue;
        if (anima_isHidden(e)) continue;
        toLoad.push(e);
    }
    toLoad.sort(function (a, b) {
        return anima_getTop(a) - anima_getTop(b);
    });
    for (var i = 0; i < toLoad.length; i++) {
        var e = toLoad[i];
        var asyncSrc = e.getAttribute("anima-src");
        e.setAttribute("src", asyncSrc);
    }
};
anima_pauseHiddenVideos = function (tag) {
    var elements = document.getElementsByTagName("video");
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i];
        var isPlaying = !!(e.currentTime > 0 && !e.paused && !e.ended && e.readyState > 2);
        var isHidden = anima_isHidden(e);
        if (!isPlaying && !isHidden && e.getAttribute("autoplay") == "autoplay") {
            e.play();
        } else if (isPlaying && isHidden) {
            e.pause();
        }
    }
};
anima_loadAsyncSrc = function (tag) {
    anima_loadAsyncSrcForTag("img");
    anima_loadAsyncSrcForTag("iframe");
    anima_loadAsyncSrcForTag("video");
    anima_pauseHiddenVideos();
};
var anima_getTop = function (e) {
    var top = 0;
    do {
        top += e.offsetTop || 0;
        e = e.offsetParent;
    } while (e);
    return top;
};
anima_loadAsyncSrc();
anima_old_onResize = window.onresize;
anima_new_onResize = undefined;
anima_updateOnResize = function () {
    if (anima_new_onResize == undefined || window.onresize != anima_new_onResize) {
        anima_new_onResize = function (x) {
            if (anima_old_onResize != undefined) anima_old_onResize(x);
            anima_loadAsyncSrc();
        };
        window.onresize = anima_new_onResize;
        setTimeout(function () {
            anima_updateOnResize();
        }, 3000);
    }
};
anima_updateOnResize();
setTimeout(function () {
    anima_loadAsyncSrc();
}, 200);

// Defining the trigger system actions
function trigger() {
    var url = window.location.pathname;
    var currentView = url.substring(url.lastIndexOf('/') + 1, url.indexOf('.html'));
    if (triggerMap[currentView].triggerID && window.setTrigger) window.setTrigger(triggerMap[currentView].triggerID);
    if (triggerMap[currentView].triggerID) {
        window.parent.postMessage({ setTrigger: { triggerID: triggerMap[currentView].triggerID } }, '*');
    }
    if (triggerMap[currentView].nextView) window.location = triggerMap[currentView].nextView + '.html' + window.location.search;
}

// Window control and on-page-load options
var isStepsDefined = typeof STEPS !== 'undefined';
function fadeIn() {
    setTimeout(function () {
        document.body.classList.add('fade-in');
    }, isStepsDefined ? 200 : 0);
}
setZoom();
window.addEventListener('resize', setZoom);
function init() {
    setZoom();
    fadeIn();
    document.querySelectorAll('[onclick], [href]').forEach(el => {
        el.tabIndex = 0;
        el.addEventListener('keypress', e => {
            // if (e.keyCode === 13) el.click()
        })
    })
    document.onkeydown = e => {
        document.body.classList.add('use-tabindex')
    }
}
document.addEventListener('DOMContentLoaded', function () {
    init();
});
function setInteractions(interactions) {
    let timing = 0;
    for (let i = 0; i < interactions.length; i++) {
        const isEl = interactions[i].dataset;
        const scrollTiming = isEl || interactions[i].el ? 500 : 0;
        timing = isEl ? parseInt(interactions[i].dataset.click) : interactions[i].delay ? interactions[i].delay : timing + 2000;
        setTimeout(() => {
            if (isEl && typeof interactions[i].dataset.noscroll === 'undefined') scrollIt(interactions[i], scrollTiming);
            if (interactions[i].el) scrollIt(document.querySelector(interactions[i].el), scrollTiming)
            setTimeout(() => {
                if (isEl) {
                    interactions[i].focus();
                    interactions[i].click();
                } else if (interactions[i].fn && typeof window[interactions[i].fn] === 'function') {
                    window[interactions[i].fn]();
                } else if (typeof window[interactions[i]] === 'function') {
                    window[interactions[i]]();
                }
            }, scrollTiming);
        }, timing);
    }
}
let urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('autorun')) {
    document.body.classList.add('autorun');
    let clicks = document.querySelectorAll('[data-click]');
    setInteractions(clicks);
    if (typeof STEPS !== 'undefined') setInteractions(STEPS);
}

// SMOOTH SCROLL
function scrollIt(destination, duration = 2500, easing = 'easeOutQuad', callback) {
    const easings = { easeOutQuad: t => t * (2 - t) };
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
    if ('requestAnimationFrame' in window === false) {
        window.scroll(0, destinationOffsetToScroll);
        if (callback) callback();
        return;
    }
    function scroll() {
        const now = 'now' in window.performance ? performance.now() : new Date().getTime();
        const time = Math.min(1, ((now - startTime) / duration));
        const timeFunction = easings[easing](time);
        window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
        if (window.pageYOffset === destinationOffsetToScroll) {
            if (callback) callback();
            return;
        }
        requestAnimationFrame(scroll);
    }
    scroll();
}

const METHODS = {

    allowOutlines: () => {
    
    document.body.classList.add("use-tabindex")
    
    sessionStorage.setItem("tabbed", true)
    
    }
    
    }
    
    
    
    window.addEventListener("message", ({ data }) => {
    
    Object.keys(data).map(key => {
    
    typeof METHODS[key] === "function" && METHODS[key](data[key])
    
    })
    
    })
    
    
