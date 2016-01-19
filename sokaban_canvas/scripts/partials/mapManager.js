define([
    'lib/event'
], function(Event) {

    var canvas = document.getElementById('gameCanvas');

    var wallPic = new Image();
    var targetPic = new Image();
    var boxPic = new Image();
    var personPic = new Image();
    var blankPic = new Image();
    wallPic.src = './images/wall.png';
    targetPic.src = './images/target.png';
    boxPic.src = './images/box.png';
    personPic.src = './images/person.png';
    blankPic.src = './images/blank.png';

    var MapManager = function() {

        this.ctx = canvas.getContext('2d');
        this.mapMatrix = [];
        this.playerPosition = {};
        this.boxPosition = [];

        this.drawStrategies = {
            '#': function(i, j) {
                this.ctx.drawImage(wallPic, j * 40, i * 40,
                    40, 40);
            },
            'T': function(i, j) {
                this.ctx.drawImage(targetPic, j * 40, i *
                    40, 40, 40);
            },
            'P': function(i, j) {
                this.ctx.drawImage(personPic, j * 40, i *
                    40, 40, 40);
            },
            'B': function(i, j) {
                this.ctx.drawImage(boxPic, j * 40, i *
                    40, 40, 40);
            },
            '0': function(i, j) {
                this.ctx.drawImage(blankPic, j * 40, i *
                    40, 40, 40);
            }
        };
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
        this.ctx.fillStyle = '#94d52f';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0, yLen = this.mapMatrix.length; i < yLen; i++) {
            for (var j = 0, xLen = this.mapMatrix[i].length; j <
                xLen; j++) {
                var drwaFn = this.drawStrategies[this.mapMatrix[i][
                    j
                ]];
                if (drwaFn) {
                    drwaFn.call(this, i, j);
                }
            }
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
            y = position.y;
        this.drawStrategies[icon].call(this, x, y);
    };

    MapManager.prototype.replaceStringWithIndex = function(string,
        index, str) {
        var first = string.slice(0, index),
            last = string.slice(index + 1);

        return first + str + last;
    };

    return MapManager;
});
