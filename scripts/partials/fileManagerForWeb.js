var FileManager = require('./fileManager.js');
var Counts = require('.././common/counts');

var fileManagerForWeb = function() {
    FileManager.apply(this);
};

fileManagerForWeb.prototype = new FileManager();

fileManagerForWeb.prototype.loadFile = function() {
    var path = Counts.webMapPath,
        fileLists = Counts.fileLists,
        request = new XMLHttpRequest();
    request.open('GET', path + fileLists[this.fileIndex], false);
    request.send(null);
    this.text = request.responseText;
    this.fileIndex = (this.fileIndex + 1 >= fileLists.length) ?
        0 : this.fileIndex + 1;
};

module.exports = fileManagerForWeb;
