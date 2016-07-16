Twitch-Preview
==================
The goal of this project was to create a userscript that would make the viewing experience on [Twitch.tv](https://www.twitch.tv/) easier and more pleasant. Often times, when viewing the list of live channels for a game the thumbnail image for a channel will not give an accurate impression of the current streamers activities. Twitch-Preview solves this problem, replacing a channel thumbnail image with the channel's live stream. 
Getting Started
---------------
These instructions will assist getting Twitch-Preview running on your browse.
### Installation
First install either [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) (Chrome) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox) depending on your preferred browser. Chrome is strongly recommended, strongly.

Next download the userscript [Twitch-Preview](https://gist.github.com/JohnBjorge/aff3176a28856566200ca8b87a936b45) by clicking on the "raw" icon. It should be added to your userscript manager (Tampermonkey or Greasemonkey).
### Try it out
If you're using Firefox, upon visiting twitch you must disable protection by clicking the lock icon left of the URL. If not, you will see a black live stream. There is currently no workaround for this and it must be done each new session unfortunately.

If you're using Chrome, once the preview loads simply click the play button.

Head on over to [Twitch.tv](https://twitch.tv), select a game, and try it out! Simply hover over a channel for 1 second and the live stream will appear.

Future Plans
-------------------
- Autoplay (Chrome)
- Disable protection workaround? (Firefox)

Credits
-------------------
[jQuery](https://github.com/jquery/jquery)
[waitForKeyElements](https://gist.github.com/BrockA/2625891)
