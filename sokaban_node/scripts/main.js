var Event = require('./lib/event.js');
var Target = require('./partials/target.js');
var MapManager = require('./partials/MapManagerForWeb.js');
var FileManager = require('./partials/fileManagerForWeb.js');
var ControlManager = require('./partials/controlManagerForWeb.js');
var Player = require('./partials/player.js');
var Box = require('./partials/box.js');

var controlManager = (function() {
    var controler = new ControlManager.keydownControler();
    controler.control();
})();

var gameManager = (function() {

    var player, mapManager, target,
        fileManager = new FileManager();

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
