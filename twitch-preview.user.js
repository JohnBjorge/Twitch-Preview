// ==UserScript==
// @name           Twitch Preview
// @description    Allows you to preview a channel upon mousing over.
// @namespace      hi
// @version        1.0
// @author         johnnybgucci (userscript user id link)
// @supportURL     https://github.com/JohnBjorge/Twitch-Preview/issues
// @include        http://*.twitch.tv/directory/game/*
// @include        https://*.twitch.tv/directory/game/*
// @grant          GM_addStyle
// @run-at         document-start
// @require        https://code.jquery.com/jquery-1.11.2.min.js
// ==/UserScript==


$(function() {

    var timeout = null;
    var browser = browserInfo().browser.toUpperCase();

    //not sure what this does. I think it breaks out of iframes?
    if(window.top !== window.self) {
        return;
    }

    //imports waitForKeyElements see non mini version below
    //try finding a cleaner solution such as last comment https://gist.github.com/BrockA/2625891#file-waitforkeyelements-js
    function waitForKeyElements(e,t,n,a){var r,o;r="undefined"==typeof a?$(e):$(a).contents().find(e),r&&r.length>0?(o=!0,r.each(function(){var e=$(this),n=e.data("alreadyFound")||!1;if(!n){var a=t(e);a?o=!1:e.data("alreadyFound",!0)}})):o=!1;var l=waitForKeyElements.controlObj||{},i=e.replace(/[^\w]/g,"_"),d=l[i];o&&n&&d?(clearInterval(d),delete l[i]):d||(d=setInterval(function(){waitForKeyElements(e,t,n,a)},300),l[i]=d),waitForKeyElements.controlObj=l};

    //waits for elements to load, once loaded calls function, false means continues to check for new elements (infinite scroll)
    waitForKeyElements(".streams .stream .content .thumb, .videos .video .content .thumb .cap", checkForElements, false);


    function checkForElements(jNode) {
        jNode.mouseenter(function() {
            var node = $(this).find("a.cap");

            timeout = setTimeout(function() {
                showPreview(node, false);
             }, 1000);
        });

        jNode.mouseleave(function() {
            removePreview();
            clearTimeout(timeout);
        });
    }

    // Generates a preview of stream on channel thumbnail. Takes an element the channel thumbnail
    // and the channel name, and a boolean for testing with a dummy frame.
    function showPreview(element, dummyFrame = false) {
        var channel = $(element).attr("href");
        channel = channel.replace(/\//g, "");
        var previewElement = getPreviewElement(element.width(), element.height(), channel, dummyFrame);
        previewElement.prependTo(element);
        cleanPreviewElement();
    }

    // Returns a preview element with embedded video. Embeds flash if chrome, embeds html5 if firefox.
    // Preview element is of size height and width of the given channel. Dummy frame is used for 
    // testing purposes and is an empty div with red border and black fill.
    function getPreviewElement(width, height, channel, dummyFrame) {
        var previewElement = "";
        if (dummyFrame === true) {
            previewElement = $("<div id='streamPreview'></div>");
            previewElement.css("height", height);
            previewElement.css("width", width);
            previewElement.css("border", "5px solid red");
            previewElement.css("background-color", "black");
        } else {
            if (browser === 'CHROME') {
                //crappy work around using flash
                previewElement = $("<div id='streamPreview'><iframe src='https://www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf?channel=" + channel + "' height=" + height + " width=" + width + " frameborder='0' scrolling='no'></iframe></div>");
            } else if (browser === 'FIREFOX') { 
                //must click lock in browser to left of url and disable protection for twitch site
                previewElement = $("<div id='streamPreview'><iframe src='https://player.twitch.tv/?channel=" + channel + "' height=" + height + " width=" + width + " frameborder='0' scrolling='no'></iframe></div>");

            } else {
                //if it's unrecognized browser I'm gonna go with flash working but doubtful
                previewElement = $("<div id='streamPreview'><iframe src='https://www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf?channel=" + channel + "' height=" + height + " width=" + width + " frameborder='0' scrolling='no'></iframe></div>");
            }
         }
        return previewElement;
    }

    function cleanPreviewElement() {
        if (browser === 'FIREFOX') {
            var iframe = $("#streamPreview iframe");
            $("#streamPreview iframe").on('load', function() {
                $("div.player-hover:nth-child(15)", iframe.contents()).remove();
                $("div.player-hover:nth-child(19)", iframe.contents()).remove();
                $("button.player-button:nth-child(19)", iframe.contents()).remove();
            });
        }
    }



    //Removes the current stream preview element
    function removePreview() {
        $("#streamPreview").remove();
    }


    // Returns the name of users browser and the version
    function browserInfo() {
        browserInfo = (function(){
            var ua= navigator.userAgent, tem,
            M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if(/trident/i.test(M[1])){
                tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE '+(tem[1] || '');
            }
            if(M[1]=== 'Chrome'){
                tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
                if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }
            M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
            return { 'browser': M[0], 'version': M[1] };
        })();
        return browserInfo;
    }
});
