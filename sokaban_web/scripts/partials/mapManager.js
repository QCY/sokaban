define(['lib/event'], function(Event) {

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
        this.renderMap();
        this.renderPerson();
        this.renderBox();
    };

    MapManager.prototype.renderMap = function() {
        document.body.innerHTML = '';
        for (var i = 0, yLen = this.mapMatrix.length; i < yLen; i++) {
            var div = document.createElement('div');
            for (var j = 0, xLen = this.mapMatrix[i].length; j <
                xLen; j++) {
                div.innerHTML += this.mapMatrix[i][j];
            }
            document.body.appendChild(div);
        }
    };

    MapManager.prototype.renderPerson = function() {
        this.renderWithPosition(this.playerPosition, 'P');
    };

    MapManager.prototype.renderBox = function() {
        for (var i = 0, boxPositon; boxPositon = this.boxPosition[i++];) {
            this.renderWithPosition(boxPositon, 'B');
        }
    };

    MapManager.prototype.renderWithPosition = function(position, icon) {
        var x = position.x,
            y = position.y,
            div = document.getElementsByTagName('div')[x];
        div.innerHTML = this.replaceStringWithIndex(div.innerHTML,
            y, icon);
    };

    MapManager.prototype.replaceStringWithIndex = function(string,
        index, str) {
        var first = string.slice(0, index),
            last = string.slice(index + 1);

        return first + str + last;
    };

    return MapManager;
});
