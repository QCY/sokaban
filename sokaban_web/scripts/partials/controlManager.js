define([
    'lib/event',
    'common/counts'
], function(Event, Counts) {

    var keydownCommands = {
        38: 'moveUp',
        39: 'moveRight',
        40: 'moveDown',
        37: 'moveLeft'
    };

    var KeydownControler = function(commands) {
        Event.installEvent(this);

        document.onkeydown = function(e) {

            var keyCode = e.keyCode,
                state = keydownCommands[keyCode];
            if (state) {
                this.trigger('onMove', state);
            }

        }.bind(this);
    };

    KeydownControler.prototype.configKey = function() {
        var btn = document.querySelector('[name="button"]');

        btn.onclick = function() {
            keydownCommands = {};
            var upValue = Counts.keyCode[document.querySelector(
                    '[name="up"]').value.toUpperCase()],
                downValue = Counts.keyCode[document.querySelector(
                    '[name="down"]').value.toUpperCase()],
                rightValue = Counts.keyCode[document.querySelector(
                    '[name="right"]').value.toUpperCase()],
                leftValue = Counts.keyCode[document.querySelector(
                    '[name="left"]').value.toUpperCase()];

            keydownCommands[upValue] = 'moveUp';
            keydownCommands[rightValue] = 'moveRight';
            keydownCommands[downValue] = 'moveDown';
            keydownCommands[leftValue] = 'moveLeft';
        };
    };

    return {
        KeydownControler: KeydownControler
    };
});
