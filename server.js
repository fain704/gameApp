// Initialize Database
var mongojs = require('mongojs');
var db = mongojs('localhost:27017/gamedb', ['account', 'progress']);

// Require Dependencies
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

app.use('/public', express.static(__dirname + '/Views/public'));
// app.use('/game', express.static(__dirname + '/Views/public/game.html'))

app.use('/game', function (req, res) {
    // console.log("------------------hi------------------")
    res.sendFile(__dirname + '/Views/public/game.html');
});

app.use(express.static('client/build'));

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/client/build');
// });


// Setting PORT to local host
serv.listen(process.env.PORT || 6969);
console.log('server running...');

// Initialize empty object for web sockets

var SOCKET_LIST = {};
// Super Constructor to set 'self' for players & bullets
var Entity = function (param) {
    var self = {
        x: 250,
        y: 250,
        spdX: 0,
        spdY: 0,
        id: "",
        map: "forest"
    }
    if (param) {
        if (param.x) {
            self.x = param.x;
        }
        if (param.y) {
            self.y = param.y;
        }
        if (param.map) {
            self.map = param.map
        }
        if (param.id) {
            self.id = param.id
        }
    }

    self.update = function () {
        self.updatePosition();
    }

    self.updatePosition = function () {
        self.x += self.spdX;
        self.y += self.spdY;
    }
    self.getDistance = function (pt) {
        return Math.sqrt(Math.pow(self.x - pt.x, 2) + Math.pow(self.y - pt.y, 2));
    }
    return self;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Player Constructor
var Player = function (param) {
    var self = Entity(param);
    // self.id = id;
    self.type = 'mage';
    self.number = "" + Math.floor(Math.random() * 10);
    self.username = param.username;
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingAttack = false;
    self.mouseAngle = 0;
    self.maxSpd = 10;
    self.hp = 10;
    self.hpMax = 10;
    self.score = 0;

    var super_update = self.update;
    self.update = function () {
        self.updateSpd();
        super_update();

        if (self.pressingAttack) {
            self.shootBullet(self.mouseAngle);
        }
    }

    self.shootBullet = function (angle) {
        Bullet({
            parent: self.id,
            angle: angle,
            x: self.x,
            y: self.y,
            map: self.map
        });
    }

    self.updateSpd = function () {
        if (self.pressingRight)
            self.spdX = self.maxSpd;
        else if (self.pressingLeft)
            self.spdX = -self.maxSpd;
        else
            self.spdX = 0;

        if (self.pressingUp)
            self.spdY = -self.maxSpd;
        else if (self.pressingDown)
            self.spdY = self.maxSpd;
        else
            self.spdY = 0;
    }

    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            number: self.number,
            hp: self.hp,
            hpMax: self.hpMax,
            score: self.score,
            map: self.map
        };
    }

    self.getUpdatePack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            hp: self.hp,
            score: self.score,
            map: self.map
        };
    }


    Player.list[self.id] = self;

    initPack.player.push(self.getInitPack());
    return self;

}



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var Fighter = function (param) {
    var self = Entity(param);
    // self.id = id;
    self.type = 'fighter';
    self.number = "" + Math.floor(Math.random() * 10);
    self.username = param.username;
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingAttack = false;
    self.mouseAngle = 0;
    self.maxSpd = 5;
    self.hp = 3;
    self.hpMax = 4;
    self.score = 1;

    var super_update = self.update;
    self.update = function () {
        self.updateSpd();
        super_update();

        if (self.pressingAttack) {
            self.shootBullet(self.mouseAngle);
        }
    }

    self.shootBullet = function (angle) {
        Sword({
            parent: self.id,
            angle: angle,
            x: self.x,
            y: self.y,
            map: self.map
        });
    }

    self.updateSpd = function () {
        if (self.pressingRight)
            self.spdX = self.maxSpd;
        else if (self.pressingLeft)
            self.spdX = -self.maxSpd;
        else
            self.spdX = 0;

        if (self.pressingUp)
            self.spdY = -self.maxSpd;
        else if (self.pressingDown)
            self.spdY = self.maxSpd;
        else
            self.spdY = 0;
    }

    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            number: self.number,
            hp: self.hp,
            hpMax: self.hpMax,
            score: self.score,
            map: self.map
        };
    }

    self.getUpdatePack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            hp: self.hp,
            score: self.score,
            map: self.map
        };
    }


    Player.list[self.id] = self;

    initPack.player.push(self.getInitPack());
    return self;

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


var Ranger = function (param) {
    var self = Entity(param);
    // self.id = id;
    self.type = 'ranger';
    self.number = "" + Math.floor(Math.random() * 10);
    self.username = param.username;
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingAttack = false;
    self.mouseAngle = 0;
    self.maxSpd = 15;
    self.hp = 5;
    self.hpMax = 5;
    self.score = 2;

    var super_update = self.update;
    self.update = function () {
        self.updateSpd();
        super_update();

        if (self.pressingAttack) {
            self.shootBullet(self.mouseAngle);
        }
    }

    self.shootBullet = function (angle) {
        Arrow({
            parent: self.id,
            angle: angle,
            x: self.x,
            y: self.y,
            map: self.map
        });
    }

    self.updateSpd = function () {
        if (self.pressingRight)
            self.spdX = self.maxSpd;
        else if (self.pressingLeft)
            self.spdX = -self.maxSpd;
        else
            self.spdX = 0;

        if (self.pressingUp)
            self.spdY = -self.maxSpd;
        else if (self.pressingDown)
            self.spdY = self.maxSpd;
        else
            self.spdY = 0;
    }

    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            number: self.number,
            hp: self.hp,
            hpMax: self.hpMax,
            score: self.score,
            map: self.map
        };
    }

    self.getUpdatePack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            hp: self.hp,
            score: self.score,
            map: self.map
        };
    }


    Player.list[self.id] = self;

    initPack.player.push(self.getInitPack());
    return self;

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


var Paladin = function (param) {
    var self = Entity(param);
    // self.id = id;
    self.type = 'paladin';
    self.number = "" + Math.floor(Math.random() * 10);
    self.username = param.username;
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingAttack = false;
    self.mouseAngle = 0;
    self.maxSpd = 3;
    self.hp = 20;
    self.hpMax = 20;
    self.score = 4;

    var super_update = self.update;
    self.update = function () {
        self.updateSpd();
        super_update();

        if (self.pressingAttack) {
            self.shootBullet(self.mouseAngle);
        }
    }

    self.shootBullet = function (angle) {
        Spear({
            parent: self.id,
            angle: angle,
            x: self.x,
            y: self.y,
            map: self.map
        });
    }

    self.updateSpd = function () {
        if (self.pressingRight)
            self.spdX = self.maxSpd;
        else if (self.pressingLeft)
            self.spdX = -self.maxSpd;
        else
            self.spdX = 0;

        if (self.pressingUp)
            self.spdY = -self.maxSpd;
        else if (self.pressingDown)
            self.spdY = self.maxSpd;
        else
            self.spdY = 0;
    }

    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            number: self.number,
            hp: self.hp,
            hpMax: self.hpMax,
            score: self.score,
            map: self.map
        };
    }

    self.getUpdatePack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            hp: self.hp,
            score: self.score,
            map: self.map
        };
    }


    Player.list[self.id] = self;

    initPack.player.push(self.getInitPack());
    return self;

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Player.list = {};
Player.onConnect = function (socket, username) {
    var map = 'forest';
    if (Math.random() < 0.5) {
        map = 'field';
    }

    // This is where we actually CREATE the player
    var player = Player({
        username: username,
        // CLASS: ??
        id: socket.id,
        map: map
    });

    socket.on('keyPress', function (data) {
        if (data.inputId === 'left')
            player.pressingLeft = data.state;
        else if (data.inputId === 'right')
            player.pressingRight = data.state;
        else if (data.inputId === 'up')
            player.pressingUp = data.state;
        else if (data.inputId === 'down')
            player.pressingDown = data.state;
        else if (data.inputId === 'attack')
            player.pressingAttack = data.state;
        else if (data.inputId === 'mouseAngle')
            player.mouseAngle = data.state;
    });

    socket.on('changeMap', function (data) {
        if (player.map === 'field') {
            player.map = 'forest';
        } else {
            player.map = 'field';
        }
        // console.log(player.map);
    });

    socket.on('sendMsgToServer', function (data) {
        for (var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', player.username + ': ' + data);
        }
    });

    socket.on('sendPmToServer', function (data) {
        var recipientSocket = null;
        for (var i in Player.list) {
            if (Player.list[i].username === data.username) {
                recipientSocket = SOCKET_LIST[i];
            }
        }
        if (recipientSocket === null) {
            socket.emit('addToChat', 'SORRY! ' + data.username + ' is OFFLINE.');
        } else {
            recipientSocket.emit('addToChat', 'PM from ' + player.username + ': ' + data.message);
            socket.emit('addToChat', 'PM to: ' + data.username + ': ' + data.message);
        }


    });

    socket.emit('init', {
        selfId: socket.id,
        type: 'mage',
        player: Player.getAllInitPack(),
        bullet: Bullet.getAllInitPack()
    });

};






Fighter.onConnect = function (socket, username) {

    var map = 'forest';
    if (Math.random() < 0.5) {
        map = 'field';
    }

    // This is where we actually CREATE the player
    var player = Fighter({
        username: username,
        id: socket.id,
        map: map
    });

    socket.on('keyPress', function (data) {
        if (data.inputId === 'left')
            player.pressingLeft = data.state;
        else if (data.inputId === 'right')
            player.pressingRight = data.state;
        else if (data.inputId === 'up')
            player.pressingUp = data.state;
        else if (data.inputId === 'down')
            player.pressingDown = data.state;
        else if (data.inputId === 'attack')
            player.pressingAttack = data.state;
        else if (data.inputId === 'mouseAngle')
            player.mouseAngle = data.state;
    });

    socket.on('changeMap', function (data) {
        if (player.map === 'field') {
            player.map = 'forest';
        } else {
            player.map = 'field';
        }
        //console.log(player.map);
    });

    socket.on('sendMsgToServer', function (data) {
        for (var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', player.username + ': ' + data);
        }
    });

    socket.on('sendPmToServer', function (data) {
        var recipientSocket = null;
        for (var i in Player.list) {
            if (Player.list[i].username === data.username) {
                recipientSocket = SOCKET_LIST[i];
            }
        }
        if (recipientSocket === null) {
            socket.emit('addToChat', 'SORRY! ' + data.username + ' is OFFLINE.');
        } else {
            recipientSocket.emit('addToChat', 'PM from ' + player.username + ': ' + data.message);
            socket.emit('addToChat', 'PM to: ' + data.username + ': ' + data.message);
        }


    });

    socket.emit('init', {
        selfId: socket.id,
        type: 'fighter',
        player: Fighter.getAllInitPack(),
        bullet: Sword.getAllInitPack()
    });

};



Ranger.onConnect = function (socket, username) {

    var map = 'forest';
    if (Math.random() < 0.5) {
        map = 'field';
    }

    // This is where we actually CREATE the player
    var player = Ranger({
        username: username,
        id: socket.id,
        map: map
    });

    socket.on('keyPress', function (data) {
        if (data.inputId === 'left')
            player.pressingLeft = data.state;
        else if (data.inputId === 'right')
            player.pressingRight = data.state;
        else if (data.inputId === 'up')
            player.pressingUp = data.state;
        else if (data.inputId === 'down')
            player.pressingDown = data.state;
        else if (data.inputId === 'attack')
            player.pressingAttack = data.state;
        else if (data.inputId === 'mouseAngle')
            player.mouseAngle = data.state;
    });

    socket.on('changeMap', function (data) {
        if (player.map === 'field') {
            player.map = 'forest';
        } else {
            player.map = 'field';
        }
        // console.log(player.map);
    });

    socket.on('sendMsgToServer', function (data) {
        for (var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', player.username + ': ' + data);
        }
    });

    socket.on('sendPmToServer', function (data) {
        var recipientSocket = null;
        for (var i in Player.list) {
            if (Player.list[i].username === data.username) {
                recipientSocket = SOCKET_LIST[i];
            }
        }
        if (recipientSocket === null) {
            socket.emit('addToChat', 'SORRY! ' + data.username + ' is OFFLINE.');
        } else {
            recipientSocket.emit('addToChat', 'PM from ' + player.username + ': ' + data.message);
            socket.emit('addToChat', 'PM to: ' + data.username + ': ' + data.message);
        }


    });

    socket.emit('init', {
        selfId: socket.id,
        type: 'ranger',
        player: Ranger.getAllInitPack(),
        bullet: Arrow.getAllInitPack()
    });

};




Paladin.onConnect = function (socket, username) {

    var map = 'forest';
    if (Math.random() < 0.5) {
        map = 'field';
    }

    // This is where we actually CREATE the player
    var player = Paladin({
        username: username,
        id: socket.id,
        map: map
    });

    socket.on('keyPress', function (data) {
        if (data.inputId === 'left')
            player.pressingLeft = data.state;
        else if (data.inputId === 'right')
            player.pressingRight = data.state;
        else if (data.inputId === 'up')
            player.pressingUp = data.state;
        else if (data.inputId === 'down')
            player.pressingDown = data.state;
        else if (data.inputId === 'attack')
            player.pressingAttack = data.state;
        else if (data.inputId === 'mouseAngle')
            player.mouseAngle = data.state;
    });

    socket.on('changeMap', function (data) {
        if (player.map === 'field') {
            player.map = 'forest';
        } else {
            player.map = 'field';
        }
        //console.log(player.map);
    });

    socket.on('sendMsgToServer', function (data) {
        for (var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', player.username + ': ' + data);
        }
    });

    socket.on('sendPmToServer', function (data) {
        var recipientSocket = null;
        for (var i in Player.list) {
            if (Player.list[i].username === data.username) {
                recipientSocket = SOCKET_LIST[i];
            }
        }
        if (recipientSocket === null) {
            socket.emit('addToChat', 'SORRY! ' + data.username + ' is OFFLINE.');
        } else {
            recipientSocket.emit('addToChat', 'PM from ' + player.username + ': ' + data.message);
            socket.emit('addToChat', 'PM to: ' + data.username + ': ' + data.message);
        }


    });

    socket.emit('init', {
        selfId: socket.id,
        type: 'paladin',
        player: Paladin.getAllInitPack(),
        bullet: Spear.getAllInitPack()
    });

};






Player.getAllInitPack = function () {

    var players = [];
    for (var i in Player.list) {
        players.push(Player.list[i].getInitPack());
    }
    return players;

}

Fighter.getAllInitPack = function () {

    var players = [];
    for (var i in Player.list) {
        players.push(Player.list[i].getInitPack());
    }
    return players;

}

Ranger.getAllInitPack = function () {

    var players = [];
    for (var i in Player.list) {
        players.push(Player.list[i].getInitPack());
    }
    return players;

}

Paladin.getAllInitPack = function () {

    var players = [];
    for (var i in Player.list) {
        players.push(Player.list[i].getInitPack());
    }
    return players;

}


Player.onDisconnect = function (socket) {
    delete Player.list[socket.id];
    removePack.player.push(socket.id);
}

Fighter.onDisconnect = function (socket) {
    delete Player.list[socket.id];
    removePack.player.push(socket.id);
}

Player.update = function () {
    var pack = [];
    for (var i in Player.list) {
        var player = Player.list[i];
        // Changes movement speed
        player.update();
        pack.push(player.getUpdatePack());
    }
    return pack;
}

Fighter.update = function () {
    var pack = [];
    for (var i in Player.list) {
        var player = Player.list[i];
        // Changes movement speed
        player.update();
        pack.push(player.getUpdatePack());
    }
    return pack;
}

// Bullet Constructor
var Bullet = function (param) {
    var self = Entity(param);
    self.id = Math.random();
    self.angle = param.angle;
    self.spdX = Math.cos(param.angle / 180 * Math.PI) * 10;
    self.spdY = Math.sin(param.angle / 180 * Math.PI) * 10;
    self.parent = param.parent;


    self.timer = 0;
    self.toRemove = false;
    var super_update = self.update;
    self.update = function () {
        if (self.timer++ > 100)
            self.toRemove = true;
        super_update();

        for (var i in Player.list) {
            var p = Player.list[i];
            if (self.map === p.map && self.getDistance(p) < 32 && self.parent !== p.id) {
                // handle collision / hp--
                p.hp -= 1;


                if (p.hp <= 0) {
                    var shooter = Player.list[self.parent];
                    if (shooter) {
                        shooter.score += 1;
                    };
                    p.hp = p.hpMax;
                    p.x = Math.random() * 500;
                    p.y = Math.random() * 500;
                }

                self.toRemove = true;
            }
        }
    }
    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            map: self.map
        };
    }

    self.getUpdatePack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y
        };
    }

    Bullet.list[self.id] = self;
    initPack.bullet.push(self.getInitPack());
    return self;

}





//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Sword Constructor
var Sword = function (param) {
    var self = Entity(param);
    self.id = Math.random();
    self.angle = param.angle;
    self.spdX = Math.cos(param.angle / 180 * Math.PI) * 10;
    self.spdY = Math.sin(param.angle / 180 * Math.PI) * 10;
    self.parent = param.parent;


    self.timer = 0;
    self.toRemove = false;
    var super_update = self.update;
    self.update = function () {
        if (self.timer++ > 3)
            self.toRemove = true;
        super_update();

        for (var i in Player.list) {
            var p = Player.list[i];
            if (self.map === p.map && self.getDistance(p) < 32 && self.parent !== p.id) {
                // handle collision / hp--
                p.hp -= 4;


                if (p.hp <= 0) {
                    var shooter = Player.list[self.parent];
                    if (shooter) {
                        shooter.score += 1;
                    };
                    p.hp = p.hpMax;
                    p.x = Math.random() * 500;
                    p.y = Math.random() * 500;
                }

                self.toRemove = true;
            }
        }
    }
    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            map: self.map
        };
    }

    self.getUpdatePack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y
        };
    }

    Bullet.list[self.id] = self;
    initPack.bullet.push(self.getInitPack());
    return self;

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


var Arrow = function (param) {
    var self = Entity(param);
    self.id = Math.random();
    self.angle = param.angle;
    self.spdX = Math.cos(param.angle / 180 * Math.PI) * 10;
    self.spdY = Math.sin(param.angle / 180 * Math.PI) * 10;
    self.parent = param.parent;


    self.timer = 0;
    self.toRemove = false;
    var super_update = self.update;
    self.update = function () {
        if (self.timer++ > 10)
            self.toRemove = true;
        super_update();

        for (var i in Player.list) {
            var p = Player.list[i];
            if (self.map === p.map && self.getDistance(p) < 32 && self.parent !== p.id) {
                // handle collision / hp--
                p.hp -= 4;


                if (p.hp <= 0) {
                    var shooter = Player.list[self.parent];
                    if (shooter) {
                        shooter.score += 1;
                    };
                    p.hp = p.hpMax;
                    p.x = Math.random() * 500;
                    p.y = Math.random() * 500;
                }

                self.toRemove = true;
            }
        }
    }
    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            map: self.map
        };
    }

    self.getUpdatePack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y
        };
    }

    Bullet.list[self.id] = self;
    initPack.bullet.push(self.getInitPack());
    return self;

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


var Spear = function (param) {
    var self = Entity(param);
    self.id = Math.random();
    self.angle = param.angle;
    self.spdX = Math.cos(param.angle / 180 * Math.PI) * 10;
    self.spdY = Math.sin(param.angle / 180 * Math.PI) * 10;
    self.parent = param.parent;


    self.timer = 0;
    self.toRemove = false;
    var super_update = self.update;
    self.update = function () {
        if (self.timer++ > 6)
            self.toRemove = true;
        super_update();

        for (var i in Player.list) {
            var p = Player.list[i];
            if (self.map === p.map && self.getDistance(p) < 32 && self.parent !== p.id) {
                // handle collision / hp--
                p.hp -= 4;


                if (p.hp <= 0) {
                    var shooter = Player.list[self.parent];
                    if (shooter) {
                        shooter.score += 1;
                    };
                    p.hp = p.hpMax;
                    p.x = Math.random() * 500;
                    p.y = Math.random() * 500;
                }

                self.toRemove = true;
            }
        }
    }
    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            map: self.map
        };
    }

    self.getUpdatePack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y
        };
    }

    Bullet.list[self.id] = self;
    initPack.bullet.push(self.getInitPack());
    return self;

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~





Bullet.list = {};

Bullet.update = function () {
    var pack = [];
    for (var i in Bullet.list) {
        var bullet = Bullet.list[i];
        // Changes movement speed
        bullet.update();
        if (bullet.toRemove) {
            delete Bullet.list[i];
            removePack.bullet.push(bullet.id);
        } else
            pack.push(bullet.getUpdatePack());
    }
    return pack;
}

Bullet.getAllInitPack = function () {
    var bullets = [];
    for (var i in Bullet.list) {
        bullets.push(Bullet.list[i].getInitPack());
    }
    return bullets;
}




Sword.update = function () {
    var pack = [];
    for (var i in Bullet.list) {
        var bullet = Bullet.list[i];
        // Changes movement speed
        bullet.update();
        if (bullet.toRemove) {
            delete Bullet.list[i];
            removePack.bullet.push(bullet.id);
        } else
            pack.push(bullet.getUpdatePack());
    }
    return pack;
}


Sword.getAllInitPack = function () {
    var bullets = [];
    for (var i in Bullet.list) {
        bullets.push(Bullet.list[i].getInitPack());
    }
    return bullets;
}



Arrow.update = function () {
    var pack = [];
    for (var i in Bullet.list) {
        var bullet = Bullet.list[i];
        // Changes movement speed
        bullet.update();
        if (bullet.toRemove) {
            delete Bullet.list[i];
            removePack.bullet.push(bullet.id);
        } else
            pack.push(bullet.getUpdatePack());
    }
    return pack;
}


Arrow.getAllInitPack = function () {
    var bullets = [];
    for (var i in Bullet.list) {
        bullets.push(Bullet.list[i].getInitPack());
    }
    return bullets;
}



Spear.update = function () {
    var pack = [];
    for (var i in Bullet.list) {
        var bullet = Bullet.list[i];
        // Changes movement speed
        bullet.update();
        if (bullet.toRemove) {
            delete Bullet.list[i];
            removePack.bullet.push(bullet.id);
        } else
            pack.push(bullet.getUpdatePack());
    }
    return pack;
}


Spear.getAllInitPack = function () {
    var bullets = [];
    for (var i in Bullet.list) {
        bullets.push(Bullet.list[i].getInitPack());
    }
    return bullets;
}




var DEBUG = true;

var isValidPassword = function (data, cb) {
    db.account.find({
        username: data.username,
        password: data.password
    }, function (err, res) {
        if (res.length > 0)
            cb(true);
        else
            cb(false);
    });
}

var isUsernameTaken = function (data, cb) {
    db.account.find({
        username: data.username
    }, function (err, res) {
        if (res.length > 0)
            cb(true);
        else
            cb(false);
    });
}

var addUser = function (data, cb) {
    db.account.insert({
        username: data.username,
        password: data.password
    }, function (err) {
        return cb();
    });
}

// Setup Socket.io packets
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    // Package sent from public containing Username & Password
    socket.on('signIn', function (data) {
        isValidPassword(data, function (res) {
            if (res) {
                // Passing data.username as a param gives us access to username in the connect function
                // MOVE THIS TO THE SOCKET.ON('"CHAR"SELECT', )
                //Player.onConnect(socket, data.username);
                // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                socket.emit('signInResponse', {
                    success: true
                });
            } else {
                socket.emit('signInResponse', {
                    success: false
                });
            }
        });
    });




    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    socket.on('fighterSelect', function (data) {
        Fighter.onConnect(socket, data.username);
        socket.emit('charChoosen', {
            hasChar: true
        });
    });

    // Uses the Player object
    socket.on('mageSelect', function (data) {
        Player.onConnect(socket, data.username);
        socket.emit('charChoosen', {
            hasChar: true
        });
    });

    socket.on('rangerSelect', function (data) {
        Ranger.onConnect(socket, data.username);
        socket.emit('charChoosen', {
            hasChar: true
        });
    });

    socket.on('paladinSelect', function (data) {
        Paladin.onConnect(socket, data.username);
        socket.emit('charChoosen', {
            hasChar: true
        });
    });



    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




    socket.on('signUp', function (data) {
        isUsernameTaken(data, function (res) {
            if (res) {
                socket.emit('signUpResponse', {
                    success: false
                });
            } else {
                addUser(data, function () {
                    socket.emit('signUpResponse', {
                        success: true
                    });
                });
            }
        });
    });

    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });

    socket.on('evalServer', function (data) {
        if (!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer', res);
    })
});

// Create Player
var initPack = {
    player: [],
    bullet: []
};

// Remove Player
var removePack = {
    player: [],
    bullet: []
};

// Calls update loop
setInterval(function () {
    //console.log(pack);
    var pack = {
        player: Player.update(),
        bullet: Bullet.update()
    }

    /*var fpack = {
        player: Fighter.update(),
        bullet: Sword.update()
    }*/

    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('init', initPack);
        socket.emit('update', pack);
        socket.emit('remove', removePack);
    }

    // Empties the packs every frame to avoid duplications
    initPack.player = [];
    initPack.bullet = [];
    removePack.player = [];
    removePack.bullet = [];

}, 1000 / 25)
