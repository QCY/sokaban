(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var counts = {
    mapPath: 'maps/',
    fileLists: [
        'map1.txt', 'map2.txt', 'map3.txt', 'map4.txt'
    ]
};

module.exports = counts;

},{}],2:[function(require,module,exports){
var Event = (function() {
    var event = {
        clientList: {},
        listen: function(key, fn) {
            if (!this.clientList[key]) {
                this.clientList[key] = [];
            }
            this.clientList[key].push(fn)
        },
        trigger: function() {
            var key = Array.prototype.shift.call(
                    arguments),
                fns = this.clientList[key];

            if (!fns || fns.length === 0) {
                return false;
            }

            for (var i = 0, fn; fn = fns[i++];) {
                fn.apply(this, arguments);
            }
        },
        remove: function(key, fn) {
            var fns = this.clientList[key];
            if (!fns) {
                return false;
            }

            delete this.clientList[key];
        }
    };

    var installEvent = function(obj) {
        for (var i in event) {
            obj[i] = event[i];
        }
    };

    return {
        installEvent: installEvent
    };
})();
module.exports = Event;

},{}],3:[function(require,module,exports){
var Event = require('./lib/event.js');
var Target = require('./partials/target.js');
var MapManager = require('./partials/mapManager.js');
var FileManager = require('./partials/fileManager.js');
var ControlManager = require('./partials/controlManager.js');
var Player = require('./partials/player.js');
var Box = require('./partials/box.js');

var controlManager = (function() {
    var controler = new ControlManager.keydownControler();
})();

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

},{"./lib/event.js":2,"./partials/box.js":4,"./partials/controlManager.js":5,"./partials/fileManager.js":6,"./partials/mapManager.js":7,"./partials/player.js":9,"./partials/target.js":10}],4:[function(require,module,exports){
var MoveableMarker = require('./marker.js').MoveableMarker;
var Event = require('.././lib/event.js');

var Box = function(id) {
    MoveableMarker.apply(this);
    this.boxId = id;
    this.attribute = 'B';
};

var boxMoveStrategies = (function() {
    return {
        '#': function() {
            return;
        },
        '0': function(player, box, nextPosition) {
            player.setPosition(box.position);
            box.setPosition(nextPosition);
            this.trigger('onMatrixChange', player);
            this.trigger('boxOverTarget', box);
        },
        'B': function() {
            return;
        },
        'T': function(player, box, nextPosition) {
            player.setPosition(box.position);
            box.setPosition(nextPosition);
            this.trigger('onMatrixChange', player);
            this.trigger('boxOnTarget', box);
        }
    };
})();

Event.installEvent(boxMoveStrategies);

Box.prototype = new MoveableMarker();

Box.prototype.moveControl = function(state, player) {
    var nextPosition = this[state](this.position),
        nextMarker = player.getMarker(nextPosition);

    boxMoveStrategies[nextMarker.attribute || nextMarker](player, this,
        nextPosition);
}

module.exports = Box;

},{".././lib/event.js":2,"./marker.js":8}],5:[function(require,module,exports){
var Event = require('.././lib/event.js');
// var keypress = require('keypress');
// keypress(process.stdin);

var keydownControler = function() {
    Event.installEvent(this);

    var keydownCommands = {
        '38': 'moveUp',
        '39': 'moveRight',
        '40': 'moveDown',
        '37': 'moveLeft'
    };

    // process.stdin.on('keypress', function(ch, key) {
    //     var transformer = {
    //         'up': '38',
    //         'down': '40',
    //         'right': '39',
    //         'left': '37'
    //     };
    //     if (transformer[key.name]) {
    //         onkeydown(transformer[key.name]);
    //     }
    //     if (key && key.ctrl && key.name == 'c') {
    //         process.stdin.pause();
    //     }
    // });
    //
    // process.stdin.setRawMode(true);
    // process.stdin.resume();

    document.onkeydown = function(e) {

        var keyCode = e.keyCode,
            state = keydownCommands[keyCode];

        if (state) {
            this.trigger('onMove', state);
        }

    }.bind(this);
};

module.exports = {
    keydownControler: keydownControler
};

},{".././lib/event.js":2}],6:[function(require,module,exports){
var Counts = require('.././common/counts');

var fileManager = (function() {
    var text,
        fileIndex = 0,
        path = Counts.mapPath,
        fileLists = Counts.fileLists;

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
})();

module.exports = fileManager;

},{".././common/counts":1}],7:[function(require,module,exports){
var Event = require('.././lib/event.js');

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

},{".././lib/event.js":2}],8:[function(require,module,exports){
var Event = require('.././lib/event.js');

var Marker = function() {
    this.position = {};
}

Marker.prototype.setPosition = function(position) {
    this.position.x = position.x;
    this.position.y = position.y;
};

var MoveableMarker = function() {
    Marker.apply(this);
    Event.installEvent(this);
}
MoveableMarker.prototype = new Marker();

MoveableMarker.prototype.moveUp = function(position) {
    return {
        x: position.x - 1,
        y: position.y
    };
};

MoveableMarker.prototype.moveRight = function(position) {
    return {
        x: position.x,
        y: position.y + 1
    };
};

MoveableMarker.prototype.moveDown = function(position) {
    return {
        x: position.x + 1,
        y: position.y
    };
};

MoveableMarker.prototype.moveLeft = function(position) {
    return {
        x: position.x,
        y: position.y - 1
    };
};

MoveableMarker.prototype.setPosition = function(position) {
    this.position.x = position.x;
    this.position.y = position.y;
};

var NnMoveableMarker = function() {
    Marker.apply(this);
}

NnMoveableMarker.prototype = new Marker();

module.exports = {
    MoveableMarker: MoveableMarker,
    NnMoveableMarker: NnMoveableMarker
}

},{".././lib/event.js":2}],9:[function(require,module,exports){
var MoveableMarker = require('./marker.js').MoveableMarker;
var Event = require('.././lib/event.js');

var Player = function(matrix) {
    this.gameBoxs = [];
    this.matrix = matrix;
};

var playerMoveStrategies = (function() {
    return {
        '#': function() {
            return;
        },
        '0': function(state, player, nextPosition) {
            player.setPosition(nextPosition);
            this.trigger('onMatrixChange', player);
        },
        'B': function(state, player, nextPosition, box) {
            box.moveControl(state, player);
        },
        'T': function() {
            this['0'].apply(this, arguments);
        }
    };
})();

Event.installEvent(playerMoveStrategies);

Player.prototype = new MoveableMarker();

Player.prototype.moveControl = function(state) {
    var nextPosition = this[state](this.position),
        nextMarker = this.getMarker(nextPosition);
    playerMoveStrategies[nextMarker.attribute || nextMarker](state, this,
        nextPosition, nextMarker);
}

Player.prototype.getMarker = function(position) {
    return this.isBox(position) || this.matrix[position.x][position.y];
};

Player.prototype.bindBox = function(box) {
    this.gameBoxs.push(box);
};

Player.prototype.isBox = function(position) {
    for (var i = 0, box; box = this.gameBoxs[i++];) {
        if (box.position.x === position.x && box.position.y ===
            position.y) {
            return box;
        }
    }
    return false;
};

module.exports = Player;

},{".././lib/event.js":2,"./marker.js":8}],10:[function(require,module,exports){
var NnMoveableMarker = require('./marker.js').NnMoveableMarker;
var Event = require('.././lib/event.js');

var Target = function() {
    Event.installEvent(this);
    this.boxContainer = {};
};

Target.prototype = new NnMoveableMarker();

Target.prototype.addBox = function(box) {
    this.boxContainer[box.boxId] = box;
    this.judgeWin();
};

Target.prototype.removeBox = function(box) {
    delete this.boxContainer[box.boxId];
};

Target.prototype.setLength = function(length) {
    this.length = length;
};

Target.prototype.getLength = function() {
    var index = 0;
    for (var key in this.boxContainer) {
        index++;
    }
    return index;
};

Target.prototype.judgeWin = function() {
    if (this.getLength() === this.length) {
        console.log('win!!!!!!!!!!!!');
        this.trigger('gameOver');
    }
};

module.exports = Target;

},{".././lib/event.js":2,"./marker.js":8}]},{},[3]);
