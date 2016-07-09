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

    // <script src= "http://player.twitch.tv/js/embed/v1.js"></script>

    var channelNumber = 1;
    var timeout = null;

    //not sure what this does. I think it breaks out of iframes?
    if(window.top !== window.self) {
        return;
    }

    //imports waitForKeyElements see non mini version below
    //try finding a cleaner solution such as last comment https://gist.github.com/BrockA/2625891#file-waitforkeyelements-js
    function waitForKeyElements(e,t,n,a){var r,o;r="undefined"==typeof a?$(e):$(a).contents().find(e),r&&r.length>0?(o=!0,r.each(function(){var e=$(this),n=e.data("alreadyFound")||!1;if(!n){var a=t(e);a?o=!1:e.data("alreadyFound",!0)}})):o=!1;var l=waitForKeyElements.controlObj||{},i=e.replace(/[^\w]/g,"_"),d=l[i];o&&n&&d?(clearInterval(d),delete l[i]):d||(d=setInterval(function(){waitForKeyElements(e,t,n,a)},300),l[i]=d),waitForKeyElements.controlObj=l};


    //function for checking state of elements that are of interest

    //waits for elements to load, once loaded calls function, false means continues to check for new elements (infinite scroll)
    waitForKeyElements(".streams .stream .content .thumb, .videos .video .content .thumb .cap", checkForElements, false);


    function checkForElements(jNode) {

        jNode.attr("id", "channel" + channelNumber);
        channelNumber++;
        jNode.mouseenter(function() {
            var node = $(this).find("a.cap");
            var channel = $(node).attr("href");
            channel = channel.replace(/\//g, "");
            showPreview(node, channel, false);

            //Activate when mouse idle over element feature, slight bug

            // $(node).mousemove(function() {
            //  if (timeout !== null) {
            //      clearTimeout(timeout);
            //  }

            //  timeout = setTimeout(function() {
            //      console.log("mouse idle for 2 seconds");
            //      //var node = $(channelElement).find("a.cap");
            //      var channel = $(node).attr("href");
            //      channel = channel.replace(/\//, "");
            //      showPreview(node, channel, true);       
            //  }, 2000);
            // });

        });

        jNode.mouseleave(function() {
            removePreview();
        });
    }

    //Takes a url and displays a preview of given channel
    function showPreview(element, channel, dummyFrame) {
        var previewElement = getPreviewElement(element.width(), element.height(), channel, dummyFrame);
        previewElement.prependTo(element);
    }

    //Returns a preview element
    function getPreviewElement(width, height, channel, dummyFrame) {
        var previewElement = "";
        if (dummyFrame === true) {
            previewElement = $("<div id='streamPreview'></div>");
            previewElement.css("height", height);
            previewElement.css("width", width);
            previewElement.css("border", "5px solid red");
            previewElement.css("background-color", "black");
        } else {
            //crappy work around using flash
            //previewElement = $("<div id='streamPreview'><iframe src='https://www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf?channel=" + channel + "' height=" + height + " width=" + width + " frameborder='0' scrolling='no'></iframe></div>");
            
            //broken due to mixed content warning
            previewElement = $("<div id='streamPreview'><iframe src='https://player.twitch.tv/?channel=" + channel + "' height=" + height + " width=" + width + " frameborder='0' scrolling='no'></iframe></div>");
        }
        return previewElement;
    }

    //Removes a preview element
    function removePreview() {
        $("#streamPreview").remove();
    }

});
