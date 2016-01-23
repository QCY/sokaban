define([
    'lib/event',
    'partials/marker',
], function(Event, Marker) {

    var Box = function(id) {
        Marker.MoveableMarker.apply(this);
        this.boxId = id;
        this.attribute = 'B';
    };

    var boxMoveStrategies = (function() {
        return {
            '#': function() {
                return;
            },
            '0': function(player, box, nextPosition, state) {
                player.setPosition(box.position);
                box.setPosition(nextPosition);
                this.trigger('onMatrixChange', state);
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

    Box.prototype = new Marker.MoveableMarker();

    Box.prototype.moveControl = function(state, player) {
        var nextPosition = this[state](this.position),
            nextMarker = player.getMarker(nextPosition);

        boxMoveStrategies[nextMarker.attribute || nextMarker](
            player, this, nextPosition, state);
    }

    return Box;
});
