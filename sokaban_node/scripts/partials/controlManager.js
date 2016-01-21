var Event = require('.././lib/event.js');

var keydownControler = function() {
    Event.installEvent(this);

    this.keydownCommands = {
        '38': 'moveUp',
        '39': 'moveRight',
        '40': 'moveDown',
        '37': 'moveLeft'
    };

};

keydownControler.prototype.control = function() {
    var keypress = require('keypress');
    keypress(process.stdin);

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
            state = this.keydownCommands[e];

        if (state) {
            this.trigger('onMove', state);
        }

    }.bind(this);
};

module.exports = {
    keydownControler: keydownControler
};
