var Counts = require('.././common/counts');

var fileManager = function() {
    this.text;
    this.fileIndex = 0;

    this.getMapMatrix = function() {
        var mapText = this.text.split('*')[0],
            matrix = [];
        mapText.split(/\r?\n/).forEach(function(line) {
            var lineArr = [];
            for (var i = 0, word; word = line[i++];) {
                lineArr.push(word);
            };
            lineArr.push('\n');
            if (lineArr.length > 1) {
                matrix.push(lineArr);
            }
        });
        return matrix;
    };

    this.getMarkerObj = function() {
        var markerText = this.text.split('*')[1];
        return JSON.parse(markerText);
    };

};

fileManager.prototype.loadFile = function() {
    var fs = require('fs');
    var path = Counts.nodeMapPath,
        fileLists = Counts.fileLists;
    this.text = fs.readFileSync(path + fileLists[this.fileIndex], 'utf8');
    this.fileIndex = (this.fileIndex + 1 >= fileLists.length) ?
        0 : this.fileIndex + 1;
};

module.exports = fileManager;
