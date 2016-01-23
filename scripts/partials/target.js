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
