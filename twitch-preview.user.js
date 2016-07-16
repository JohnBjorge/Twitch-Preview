// ==UserScript==
// @name           Twitch-Preview
// @namespace      http://johnbjorge.com
// @version        1.0
// @author         John Bjorge
// @description    Replaces twitch channel thumbnail image with live stream on mouse over.
// @supportURL     https://github.com/JohnBjorge/Twitch-Preview
// @include        http://www.twitch.tv/directory/game/*
// @include        https://www.twitch.tv/directory/game/*
// @grant          GM_addStyle
// @run-at         document-start
// @require        https://code.jquery.com/jquery-1.11.2.min.js
// @require        https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// ==/UserScript==

$(function() {

    if(window.top !== window.self) {
        return;
    }

    var timeout = null; //timer for hovering over channel
    var browser = browserInfo().browser.toUpperCase(); //current browser (chrome or firefox)

    // Waits for channel elements to load, once loaded calls main.
    // False means continues to check for new elements (infinite scroll)
    waitForKeyElements(".streams .stream .content .thumb, .videos .video .content .thumb .cap", main, false);

    // Once channel elements have loaded the function main detects mouse enter and mouse leave events
    // on the given channelNode. If mouse hovers over element for 1 second stream preview is generated.
    function main(channelNode) {
        channelNode.mouseenter(function() {
            var node = $(this).find("a.cap");

            timeout = setTimeout(function() {
                showPreview(node, false);
             }, 1000);
        });

        channelNode.mouseleave(function() {
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
                //if it's unrecognized browser I'm gonna go with flash working but doubtful it would work
                previewElement = $("<div id='streamPreview'><iframe src='https://www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf?channel=" + channel + "' height=" + height + " width=" + width + " frameborder='0' scrolling='no'></iframe></div>");
            }
         }
        return previewElement;
    }

    // Removes uneeded stream elements such as volume, pause button, etc
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

    // Removes the current stream preview element
    function removePreview() {
        $("#streamPreview").remove();
    }

    // Returns the name of browser and the version
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
