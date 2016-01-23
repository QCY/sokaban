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
        var timer;
        document.onkeydown = function(e) {

            var keyCode = e.keyCode,
                state = keydownCommands[keyCode];
            if (state) {
                if (timer) {
                    return;
                }
                timer = setTimeout(function() {
                    this.trigger('onMove', state);
                    clearTimeout(timer);
                    timer = null;
                }.bind(this), 100);
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

            if (upValue && downValue && rightValue && leftValue) {
                keydownCommands[upValue] = 'moveUp';
                keydownCommands[rightValue] = 'moveRight';
                keydownCommands[downValue] = 'moveDown';
                keydownCommands[leftValue] = 'moveLeft';
            } else {
                alert('按键配置有误，请重新配置');
            }
        };
    };

    return {
        KeydownControler: KeydownControler
    };
});
