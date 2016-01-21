var nconf = require("nconf"),
fs = require("fs");

nconf.argv()
.env('__');
nconf.defaults({
  "mongoURI": "mongodb://austin809:147159aa@ds053764.mongolab.com:53764/the-hub",
  "session": {
    "secret":"session-secret-12o3129873-0983234"
  },
  "facebook": {
    "app_id" : "1517158101884267",
    "app_secret":"d3e7d810ba013298be7dd1b14d58d77d",
    "app_callback":"/auth/facebook/callback"
  },
  "dropbox": {
    "app_key" : "ds2kqcdwy1govh4",
    "app_secret":"osonxzioqfbyavc",
    "app_callback":"http://localhost:8888/auth/dropbox/callback"
  },
  "box": {
    "client_id":"2dm9bch842zwx2bn9fwpjz9wkkr5l37i",
    "client_secret":"gWTjB4FtuLxcSYOYvwxCmNPszCi4yeG6",
    "client_security_token":"security_token%3DKnhMJatFipTAnM0nHlZA",
    "redirect":"http://localhost:8888/auth/box/callback"
  },
  "onedrive": {
    "client_id" : "000000004015E476",
    "client_secret":"D4q2lRjEDFn1L-9e79bzYwUQ8VG25kdZ",
    "redirect":"https://limitless-earth-7143.herokuapp.com/auth/onedrive/callback"
  },
  "googleDrive": {
    "client_id" : "445443597106-ute7ueutuo14r8afnq97akelvuv56ra8.apps.googleusercontent.com",
    "client_secret":"3oZZzZvhja4qdRU14Wtzb0Bj",
    "redirect":"http://localhost:8888/auth/googledrive/callback"
  }
})


module.exports = nconf;
