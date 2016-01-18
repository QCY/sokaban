var Event = require('./event.js');
var Target = require('./target.js');
var MapManager = require('./mapManager.js');
var Player = require('./player.js');
var Box = require('./box.js');
var keypress = require('keypress');
var fs = require('fs');
keypress(process.stdin);

var KeydownControler = function() {
    Event.installEvent(this);

    var keydownCommands = {
        '38': 'moveUp',
        '39': 'moveRight',
        '40': 'moveDown',
        '37': 'moveLeft'
    };

    process.stdin.on('keypress', function(ch, key) {
        var transformer = {
            'up': '38',
            'down': '40',
            'right': '39',
            'left': '37'
        };
        if (transformer[key.name]) {
            onkeydown(transformer[key.name]);
        }
        if (key && key.ctrl && key.name == 'c') {
            process.stdin.pause();
        }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();

    var onkeydown = function(e) {

        var keyCode = e.keyCode,
            state = keydownCommands[e];

        this.trigger('onMove', state);

    }.bind(this);
};

var controlManager = (function() {
    var keydownControler = new KeydownControler();
})();

var fileManager = (function() {
    var text,
        fileIndex = 0,
        fileLists = [
            'map1.txt', 'map2.txt', 'map3.txt', 'map4.txt'
        ];

    var loadFile = function() {
        text = fs.readFileSync(fileLists[fileIndex], 'utf8');
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

var gameManager = (function() {

    var player, mapManager, target;

    var gameInit = function() {
        target = new Target();
        mapManager = new MapManager();

        fileManager.loadFile();

        var markerObj = fileManager.getMarkerObj(),
            mapMatrix = fileManager.getMapMatrix();

        target.setLength(markerObj.B.length);

        player = new Player(mapMatrix);
        player.setPosition(markerObj.P.position);

        for (var i = 0, boxObj; boxObj = markerObj.B[i++];) {
            var box = new Box(boxObj.id);
            box.setPosition(boxObj.position);
            player.bindBox(box);
            mapManager.setBoxMarkers(box.position);
        }

        mapManager.setMapMatrix(mapMatrix);
        mapManager.setPlayerMarker(player.position);
        mapManager.render();

        addListener();
    };

    var gameOver = function() {
        removeListener();
        gameInit();
    };

    var addListener = function() {
        player.listen('onMove', player.moveControl.bind(player));
        mapManager.listen('onMatrixChange', mapManager.render.bind(
            mapManager));
        target.listen('boxOnTarget', target.addBox.bind(target));
        target.listen('boxOverTarget', target.removeBox.bind(target));
    };

    var removeListener = function() {
        player.remove('onMove', player.moveControl);
        mapManager.remove('onMatrixChange', mapManager.render);
        target.remove('boxOnTarget', target.addBox);
        target.remove('boxOverTarget', target.removeBox);
    };

    return {
        gameInit: gameInit,
        gameOver: gameOver
    }
})();

Event.installEvent(gameManager);
gameManager.listen('gameOver', gameManager.gameOver);
gameManager.gameInit();
