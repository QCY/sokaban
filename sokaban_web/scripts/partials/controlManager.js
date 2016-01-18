define([
    'lib/event'
], function(Event) {
    
    var KeydownControler = function() {
        Event.installEvent(this);

        var keydownCommands = {
            '38': 'moveUp',
            '39': 'moveRight',
            '40': 'moveDown',
            '37': 'moveLeft'
        };

        document.onkeydown = function(e) {

            var keyCode = e.keyCode,
                state = keydownCommands[keyCode];
            if (state) {
                this.trigger('onMove', state);
            }

        }.bind(this);
    };

    return {
        KeydownControler: KeydownControler
    };
});
