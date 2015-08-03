var express = require('express');
var router = express.Router();
var controller = require('../controller');


module.exports = function(app, passport) {

  // facebook app oAuth Login
  router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'publish_actions'] }));
  router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/auth/fb-success', failureRedirect: '/auth/fb-fail' }));
  router.get('/auth/fb-success', controller.auth.createSessionUser);
  router.get('/auth/fb-fail', controller.render);

  router.all('*', controller.auth.requireLoggedIn);
  // require logged in for all routes starting now (don't need to be logged in to log in through facebook to hit the above routes)

  // oAuth logins
  router.get('/auth/dropbox/login', controller.dropbox.getDBoxRequestToken, controller.dropbox.requestDBoxAccessToken);
  router.get('/auth/onedrive/login', controller.onedrive.getOneDriveAuthCode);
  router.get('/auth/googledrive/login', controller.googledrive.generateAuthUrl);
  router.get('/auth/box/login', controller.box.authorizeBox);

  // oAuth callbacks
  router.get('/auth/dropbox/callback', controller.dropbox.getDBoxAccessToken, controller.dropbox.getDropBoxFiles, controller.render);
  router.get('/auth/onedrive/callback', controller.onedrive.getOneDriveAccessToken, controller.onedrive.getOneDriveFiles, controller.render);
  router.get('/auth/googledrive/callback', controller.googledrive.getGoogleDriveToken, controller.googledrive.getGoogleDriveFiles, controller.render);
  router.get('/auth/box/callback', controller.box.getBoxAccessToken, controller.box.getBoxFiles,controller.render);

  router.get('/', controller.render);

  // upload route
  router.post('/file-upload', controller.uploader.readFile,controller.googledrive.upload, controller.googledrive.getGoogleDriveFiles,controller.dropbox.upload, controller.dropbox.getDropBoxFiles, controller.box.upload, controller.box.getBoxFiles, controller.onedrive.upload, controller.onedrive.getOneDriveFiles, controller.sendBackUploadedFiles);

  // file deletion route
  router.post('/delete/dropbox', controller.dropbox.deleteDropBoxFiles, controller.dropbox.getDropBoxFiles, controller.sendBackUploadedFiles);
  router.post('/delete/onedrive', controller.onedrive.deleteOneDriveFiles, controller.onedrive.getOneDriveFiles, controller.sendBackUploadedFiles);
  router.post('/delete/googledrive', controller.googledrive.deleteGoogleDriveFiles, controller.googledrive.getGoogleDriveFiles, controller.sendBackUploadedFiles);
  router.post('/delete/box', controller.box.deleteBoxFiles, controller.box.getBoxFiles, controller.sendBackUploadedFiles);

  // file download routes
  router.get('/download/dropbox/:id', controller.dropbox.downloadDropBoxFiles);
  router.get('/download/onedrive/:id', controller.onedrive.downloadOneDriveFiles);
  router.get('/download/googledrive/:id', controller.googledrive.downloadGoogleDriveFiles);
  router.get('/download/box/:id', controller.box.downloadBoxFiles);

  // logout
  router.get('/auth/logout', controller.auth.logout);

  app.use(router);
};
{
    "@odata.context": "https://api.onedrive.com/v1.0/$metadata#drives('me')/items/$entity",
    "@content.downloadUrl": "https://public-ch3301.files.1drv.com/y3m6EORBmGRJD8Tjiu5rYEV1yUKibjg5TWOxODfRapQAAAEQLmmeGgIF8v86BOeqqlAuedk3E0h0NASqHG0YLx6euDiY7wsv3O1medtdk-psPjIYnUBkqNV-oP_WUfb1zRi-V2T_VyUgRXMH9KTpb8SlgJu6ZYbWR_pXigpxvL39F1sIgcXFxJm9aftzjCnbbSz",
    "createdBy": {
        "application": {
            "displayName": "The-Hub",
            "id": "4015e476"
        },
        "user": {
            "displayName": "Austin Bourdier",
            "id": "7ed6275f2340188c"
        }
    },
    "createdDateTime": "2015-08-03T17:12:56.95Z",
    "cTag": "aYzo3RUQ2Mjc1RjIzNDAxODhDITExNi4yNTc",
    "eTag": "aN0VENjI3NUYyMzQwMTg4QyExMTYuMQ",
    "id": "7ED6275F2340188C!116",
    "lastModifiedBy": {
        "application": {
            "displayName": "The-Hub",
            "id": "4015e476"
        },
        "user": {
            "displayName": "Austin Bourdier",
            "id": "7ed6275f2340188c"
        }
    },
    "lastModifiedDateTime": "2015-08-03T17:13:02.697Z",
    "name": "bike_chase-wallpaper-2560x1600.jpg",
    "parentReference": {
        "driveId": "7ed6275f2340188c",
        "id": "7ED6275F2340188C!103",
        "path": "/drive/root:"
    },
    "size": 537679,
    "webUrl": "https://onedrive.live.com/redir?resid=7ED6275F2340188C!116",
    "file": {
        "hashes": {
            "crc32Hash": "3F22AA21",
            "sha1Hash": "D9CD5F3F58C5D9A67AD29A96079BF03B33880EE1"
        },
        "mimeType": "image/jpeg"
    },
    "fileSystemInfo": {
        "createdDateTime": "2015-08-03T17:12:56.95Z",
        "lastModifiedDateTime": "2015-08-03T17:12:56.95Z"
    },
    "image": {
        "height": 1600,
        "width": 2560
    },
    "photo": {
        "takenDateTime": "2015-08-03T17:12:56.95Z"
    }
}
