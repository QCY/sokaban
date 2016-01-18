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
