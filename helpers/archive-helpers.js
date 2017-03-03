var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(this.paths.list, 'utf8', function(err, data) {
    if (err) { throw err; }
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(this.paths.list, 'utf8', function(err, data) {
    if (err) { throw err; }
    urlList = data.split('\n');
    var isThere = false;
    for (var i = 0; i < urlList.length; i++) {
      if (urlList[i] === url) {
        isThere = true;
      }
    }
    callback(isThere);
  });

};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(this.paths.list, url + '\n', function(err) {
    if (err) { throw err; }
  });
  fs.readFile(this.paths.list, 'utf8', function(err, data) {
    if (err) { throw err; }
    callback(data.split('\n'));
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(this.paths.archivedSites, function(err, files) {
    var doesExist = false;
    for (var i = 0; i < files.length; i++) {
      if (files[i] === url) {
        doesExist = true;
      }
    }
    callback(doesExist);
  });
};

exports.downloadUrls = function(urls) {
  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];
    if (!url) { return; }
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));

    // fs.writeFile(this.paths.archivedSites + '/' + urls[i], 'Hey there!', function(err) {
    //   if (err) { throw err; }
  }
};
