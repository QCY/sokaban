var Event = require('./event.js');

var MapManager = function() {
    this.mapMatrix = [];
    this.playerPosition = {};
    this.boxPosition = [];
    Event.installEvent(this);
};

MapManager.prototype.setMapMatrix = function(matrix) {
    this.mapMatrix = matrix;
};

MapManager.prototype.setPlayerMarker = function(position) {
    this.playerPosition = position;
};

MapManager.prototype.setBoxMarkers = function(position) {
    this.boxPosition.push(position);
};

MapManager.prototype.render = function() {
    var string = '';

    for (var i = 0, yLen = this.mapMatrix.length; i < yLen; i++) {
        for (var j = 0, xLen = this.mapMatrix[i].length; j < xLen; j++) {
            var alpha = this.mapMatrix[i][j] === '0' ? ' ' : this.mapMatrix[
                i][j];
            string += alpha;
        }
    }

    string = this.replaceStringWithIndex(string, this.playerPosition.x *
        xLen + this.playerPosition.y, 'P');
    for (var i = 0, boxPosition; boxPosition = this.boxPosition[i++];) {
        string = this.replaceStringWithIndex(string, boxPosition.x *
            xLen + boxPosition.y, 'B');
    }

    console.log(string);
};

MapManager.prototype.replaceStringWithIndex = function(string, index, str) {
    var first = string.slice(0, index),
        last = string.slice(index + 1);

    return first + str + last;
};

module.exports = MapManager;
