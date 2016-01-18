require([
    'lib/event',
    'partials/mapManager',
    'partials/fileManager',
    'partials/controlManager',
    'partials/player',
    'partials/target',
    'partials/box',
], function(Event, MapManager, FileManager, ControlManager, Player,
    Target, Box) {

    var gameManager = (function() {

        var player, mapManager, target;

        var gameInit = function() {
            target = new Target();
            mapManager = new MapManager();

            FileManager.loadFile();

            var markerObj = FileManager.getMarkerObj(),
                mapMatrix = FileManager.getMapMatrix();

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

        var addListener = function() {
            player.listen('onMove', player.moveControl.bind(
                player));
            mapManager.listen('onMatrixChange', mapManager.render
                .bind(
                    mapManager));
            target.listen('boxOnTarget', target.addBox.bind(
                target));
            target.listen('boxOverTarget', target.removeBox
                .bind(target));
        };

        var removeListener = function() {
            player.remove('onMove', player.moveControl);
            mapManager.remove('onMatrixChange', mapManager.render);
            target.remove('boxOnTarget', target.addBox);
            target.remove('boxOverTarget', target.removeBox);
        };

        var gameOver = function() {
            removeListener();
            gameInit();
        };

        return {
            gameInit: gameInit,
            gameOver: gameOver
        }
    })();

    Event.installEvent(gameManager);
    gameManager.listen('gameOver', gameManager.gameOver);

    var controlManager = (function() {
        var keydownControler = new ControlManager.KeydownControler();
        keydownControler.configKey();
        gameManager.gameInit();
    })();

});
