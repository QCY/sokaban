var fs = require('fs');
var Counts = require('.././common/counts');

var fileManager = (function() {
    var text,
        fileIndex = 0,
        path = Counts.mapPath,
        fileLists = Counts.fileLists;

    var loadFile = function() {
        text = fs.readFileSync(path + fileLists[fileIndex], 'utf8');
        fileIndex = (fileIndex + 1 >= fileLists.length) ? 0 :
            fileIndex + 1;
    };

    var getMapMatrix = function() {
        var mapText = text.split('*')[0],
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

    var getMarkerObj = function() {
        var markerText = text.split('*')[1];
        return JSON.parse(markerText);
    };

    return {
        loadFile: loadFile,
        getMapMatrix: getMapMatrix,
        getMarkerObj: getMarkerObj
    }
})();

module.exports = fileManager;
