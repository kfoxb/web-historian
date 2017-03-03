var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers.js');
var fs = require('fs');
var http = require('http');
var request = require('request');

exports.handleRequest = function (req, res) {
  var headers = httpHelp.headers;
  if (req.method === 'GET') {
    res.writeHead(200, headers);
    // console.log('this is req.url:', req.url.slice(1));
    // console.log('if result: ', archive.isUrlArchived(req.url.slice(1), function() {}));
    if (req.url === '/') {
      res.writeHead(200, headers);
      fs.readFile(archive.paths.siteAssets + '/index.html', 'utf8', function(err, data) {
        if (err) { throw err; }
        res.end(data);
      });    
    } else {
      res.writeHead(200, headers);
      archive.isUrlArchived(req.url.slice(1), function(isArchived) {
        if (isArchived) {
          fs.readFile(archive.paths.archivedSites + req.url, 'utf8', function(err, data) {
            if (err) { throw err; }
            res.end(data);
          });
        } else {
          res.writeHead(404, headers);
          res.end(JSON.stringify(''));
        }
      });
    }
  } else if (req.method === 'POST') {
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      var url = data.slice(4);
      archive.isUrlInList(url, function(isInList) {
        res.writeHead(302, headers);
        if (!isInList) {
          console.log('its not in the list');
          archive.addUrlToList(url, function() {});
          fs.readFile(archive.paths.siteAssets + '/loading.html', 'utf8', function(err, data) {
            if (err) { throw err; }
            res.end(data);
          });
        } else {
          archive.isUrlArchived(url, function(isArchived) {
            res.writeHead(302, headers);
            console.log('checking if archived');
            if (isArchived) {
              console.log('it\'s archived');
              fs.readFile(archive.paths.archivedSites + '/' + url, 'utf8', function(err, data) {
                if (err) { throw err; }
                console.log('sending back data');
                res.end(data);
              });
            }
          });
        }
      });
    });
    // console.log('this is post', $url);
  }
};

  //   } else if (archive.isUrlArchived(req.url.slice(1), function(info) { return info; })) {
  //     fs.readFile(archive.paths.archivedSites + req.url, 'utf8', function(err, data) {
  //       if (err) { throw err; }
  //       res.end(data);
  //     });
  //   } else {
  //     res.writeHead(404, headers);
  //     res.end(JSON.stringify(''));
  //   }
  // } else {
  //   res.end('you made a POST');
  // }