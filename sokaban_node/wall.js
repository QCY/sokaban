var Event = require('./event.js');
var NnMoveableMarker = require('./marker.js').NnMoveableMarker;

var Wall = function() {
    Event.installEvent(this);
};

Wall.prototype = new NnMoveableMarker();

module.exports = Wall;
