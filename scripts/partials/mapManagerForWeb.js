var MapManager = require('./mapManager.js');

var MapManagerForWeb = function() {
    MapManager.apply(this);
};

MapManagerForWeb.prototype = new MapManager();

MapManagerForWeb.prototype.render = function() {
    this.renderMap();
    this.renderPerson();
    this.renderBox();
};

MapManagerForWeb.prototype.renderMap = function() {
    var gameCanvas = document.getElementById('game');
    gameCanvas.innerHTML = '';
    for (var i = 0, yLen = this.mapMatrix.length; i < yLen; i++) {
        var div = document.createElement('div');
        for (var j = 0, xLen = this.mapMatrix[i].length; j <
            xLen; j++) {
            div.innerHTML += this.mapMatrix[i][j];
        }
        gameCanvas.appendChild(div);
    }
};

MapManagerForWeb.prototype.renderPerson = function() {
    this.renderWithPosition(this.playerPosition, 'P');
};

MapManagerForWeb.prototype.renderBox = function() {
    for (var i = 0, boxPositon; boxPositon = this.boxPosition[i++];) {
        this.renderWithPosition(boxPositon, 'B');
    }
};

MapManagerForWeb.prototype.renderWithPosition = function(position, icon) {
    var x = position.x,
        y = position.y,
        div = document.getElementsByTagName('div')[x];
    div.innerHTML = this.replaceStringWithIndex(div.innerHTML,
        y, icon);
};

MapManagerForWeb.prototype.replaceStringWithIndex = function(string,
    index, str) {
    var first = string.slice(0, index),
        last = string.slice(index + 1);

    return first + str + last;
};

module.exports = MapManagerForWeb;
