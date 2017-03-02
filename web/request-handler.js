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
    console.log('this is req.url:', req.url.slice(1));
    console.log('if statement:', archive.isUrlArchived(req.url.slice(1), function(info) { return info; }));
    if (req.url === '/') {
      fs.readFile('./web/public/index.html', 'utf8', function(err, data) {
        if (err) { throw err; }
        res.end(data);
      });
    } else if (archive.isUrlArchived(req.url.slice(1), function(info) { return info; })) {
      fs.readFile(archive.paths.archivedSites + req.url, 'utf8', function(err, data) {
        if (err) { throw err; }
        res.end(data);
      });
    } else {
      res.writeHead(404, headers);
      res.end(JSON.stringify(''));
    }
  } else {
    res.end('you made a POST');
  }
};
