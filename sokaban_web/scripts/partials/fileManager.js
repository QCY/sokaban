define(function() {

    var text,
        fileIndex = 0,
        path = './maps/',
        fileLists = [
            'map1.txt', 'map2.txt', 'map3.txt', 'map4.txt'
        ];

    var loadFile = function() {
        var request = new XMLHttpRequest();
        request.open('GET', path + fileLists[fileIndex],
            false);
        request.send(null);
        text = request.responseText;
        fileIndex = (fileIndex + 1 >= fileLists.length) ?
            0 :
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

});
