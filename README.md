# TabTrackr
A chrome extension that tracks tab usage

in the public folder, you'll find a background.js file which is responsible for running in the background and tracking the tab usage data. This data will be sent to the server every 30 seconds as you'll see in the setInterval.

The manifest.json file is responsible for providing metadata to the browser, e.g. extension permissions, icons, and important files like background.js, and index.html.
