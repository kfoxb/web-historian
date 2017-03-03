// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

archive.readListOfUrls(function(arrayOfUrls) {
  for (var i = 0; i < arrayOfUrls.length; i++) {
    archive.isUrlArchived(arrayOfUrls[i], function(doesExist) {
      if (!doesExist) {
        archive.downloadUrls([arrayOfUrls[i]]);
      }
    });
  }
});