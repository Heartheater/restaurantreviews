# Restaurant Reviews App
This is a responsive restaurant reviews website using a service worker and caching.

## How to use


This app needs to be run on a HTTP server which can be done using [Python](https://www.python.org/) to make a simple HTTP server:
1. In this folder type in 'python -m SimpleHTTPServer 8000' (where 8000 is the port*), or for Python version 3.x, you can use 'python3 -m http.server 8000'.
2. Once the server is running go to 'http://localhost:8000' to view the app.
You also might want to get a Mapbox API key from https://www.mapbox.com/, once you have your API key change every instance of `mapboxToken` in the javascript files restaurant_info.js, main.js, and service-worker.js to your Mapbox API key.

*If you use a different port than 8000 you will have to manually change the port variable inside the file "dbhelper.js". Open "dbhelper.js" and change `port = 8000` inside DATABASE_URL() to your port number.


### Credits
This app uses [leafletjs](https://leafletjs.com/), [mapbox](https://www.mapbox.com/), and [normalize.css](https://necolas.github.io/normalize.css/)
favicon from https://www.deviantart.com/pepperjack-kiwi

Developed by https://github.com/Heartheater.