// ==UserScript==
// @name           Twitch Preview
// @description    Allows you to preview a channel upon mousing over.  
// @namespace      https://github.com/JohnBjorge/Twitch-Preview
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

    //not sure what this does. I think it breaks out of iframes?
    if(window.top !== window.self) {
        return;
    }

    //imports waitForKeyElements see non mini version below
    //try finding a cleaner solution such as last comment https://gist.github.com/BrockA/2625891#file-waitforkeyelements-js
    function waitForKeyElements(e,t,n,a){var r,o;r="undefined"==typeof a?$(e):$(a).contents().find(e),r&&r.length>0?(o=!0,r.each(function(){var e=$(this),n=e.data("alreadyFound")||!1;if(!n){var a=t(e);a?o=!1:e.data("alreadyFound",!0)}})):o=!1;var l=waitForKeyElements.controlObj||{},i=e.replace(/[^\w]/g,"_"),d=l[i];o&&n&&d?(clearInterval(d),delete l[i]):d||(d=setInterval(function(){waitForKeyElements(e,t,n,a)},300),l[i]=d),waitForKeyElements.controlObj=l}


    //function for checking state of elements that are of interest

    waitForKeyElements(".streams .stream .content .thumb, .videos .video .content .thumb", checkForElements);

    function checkForElements(jNode) {
        $(".streams .stream .content .thumb .cap img, .videos .video .content .thumb .cap img").css("border", "5px solid red");
    }



});


// NONE MINI VERSION FOR DEBUGGING
// /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
//     that detects and handles AJAXed content.

//     Usage example:

//         waitForKeyElements (
//             "div.comments"
//             , commentCallbackFunction
//         );

//         //--- Page-specific function to do what we want when the node is found.
//         function commentCallbackFunction (jNode) {
//             jNode.text ("This comment changed by waitForKeyElements().");
//         }

//     IMPORTANT: This function requires your script to have loaded jQuery.
// */
// function waitForKeyElements (
//     selectorTxt,    /* Required: The jQuery selector string that
//                         specifies the desired element(s).
//                     */
//     actionFunction, /* Required: The code to run when elements are
//                         found. It is passed a jNode to the matched
//                         element.
//                     */
//     bWaitOnce,      /* Optional: If false, will continue to scan for
//                         new elements even after the first match is
//                         found.
//                     */
//     iframeSelector  /* Optional: If set, identifies the iframe to
//                         search.
//                     */
// ) {
//     var targetNodes, btargetsFound;

//     if (typeof iframeSelector == "undefined")
//         targetNodes     = $(selectorTxt);
//     else
//         targetNodes     = $(iframeSelector).contents ()
//                                            .find (selectorTxt);

//     if (targetNodes  &&  targetNodes.length > 0) {
//         btargetsFound   = true;
//         --- Found target node(s).  Go through each and act if they
//             are new.
        
//         targetNodes.each ( function () {
//             var jThis        = $(this);
//             var alreadyFound = jThis.data ('alreadyFound')  ||  false;

//             if (!alreadyFound) {
//                 //--- Call the payload function.
//                 var cancelFound     = actionFunction (jThis);
//                 if (cancelFound)
//                     btargetsFound   = false;
//                 else
//                     jThis.data ('alreadyFound', true);
//             }
//         } );
//     }
//     else {
//         btargetsFound   = false;
//     }

//     //--- Get the timer-control variable for this selector.
//     var controlObj      = waitForKeyElements.controlObj  ||  {};
//     var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
//     var timeControl     = controlObj [controlKey];

//     //--- Now set or clear the timer as appropriate.
//     if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
//         //--- The only condition where we need to clear the timer.
//         clearInterval (timeControl);
//         delete controlObj [controlKey]
//     }
//     else {
//         //--- Set a timer, if needed.
//         if ( ! timeControl) {
//             timeControl = setInterval ( function () {
//                     waitForKeyElements (    selectorTxt,
//                                             actionFunction,
//                                             bWaitOnce,
//                                             iframeSelector
//                                         );
//                 },
//                 300
//             );
//             controlObj [controlKey] = timeControl;
//         }
//     }
//     waitForKeyElements.controlObj   = controlObj;
// }