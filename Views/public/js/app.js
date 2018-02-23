var WIDTH = 500;
        var HEIGHT = 500;
        var socket = io();
        // Landing / Sign in & Sign up
        //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
        var gameDiv = document.getElementById("gameDiv");
        var signDiv = document.getElementById("signDiv");
        var signDivUsername = document.getElementById("signDiv-username");
        var signDivSignIn = document.getElementById("signDiv-signIn");
        var signDivSignUp = document.getElementById("signDiv-signUp");
        var signDivPassword = document.getElementById("signDiv-password");
        // When the user clicks sign in, a package is sent to the
        // server with the user input
        signDivSignIn.onclick = function () {
            socket.emit('signIn', {
                username: signDivUsername.value,
                password: signDivPassword.value
            });
        }
        signDivSignUp.onclick = function () {
            socket.emit('signUp', {
                username: signDivUsername.value,
                password: signDivPassword.value
            });
        }
        socket.on('signInResponse', function (data) {
            if (data.success) {
                signDiv.style.display = 'none';
                charSelDiv.style.display = 'inline-block';
                //gameDiv.style.display = 'inline-block';
            } else {
                // REPLACE WITH A MODAL OR NEW SCREEN!!
                alert("sign in unsuccessful.");
            }
        });
        socket.on('signUpResponse', function (data) {
            if (data.success) {
                alert("User Created!")
            } else {
                alert("sign up unsuccessful.");
            }
        });
        // Chat
        //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
        var chatText = document.getElementById("chat-text");
        var chatInput = document.getElementById("chat-input");
        var chatForm = document.getElementById("chat-form");
        socket.on('addToChat', function (data) {
            chatText.innerHTML += '<div>' + data + '</div>';
        });
        socket.on('evalAnswer', function (data) {
            console.log(data);
        })
        chatForm.onsubmit = function (e) {
            e.preventDefault();
            if (chatInput.value[0] === '/') {
                socket.emit('evalServer', chatInput.value.slice(1));
            } else if (chatInput.value[0] === '@') {
                socket.emit('sendPmToServer', {
                    username: chatInput.value.slice(1, chatInput.value.indexOf(',')),
                    message: chatInput.value.slice(chatInput.value.indexOf(',') + 1)
                });
            } else {
                socket.emit('sendMsgToServer', chatInput.value);
            }
            chatInput.value = '';
        }
        // Character Select // STEP 1
        //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
        var charSelDiv = document.getElementById("charSelect");
        var char1 = document.getElementById("char1");
        var char2 = document.getElementById("char2");
        var char3 = document.getElementById("char3");
        var char4 = document.getElementById("char4");
        // Selecting Character from Selection Screen
        //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
        // CHANGED 'CLASSNAME' BOOL (MAGE) TO 'STATE'
        char1.onclick = function () {
            socket.emit('fighterSelect', {
                username: signDivUsername.value,
                charId: 'fighter',
                state: true
            });
            //charSelDiv.style.display = 'none';
            //gameDiv.style.display = 'inline-block';
        }
        char2.onclick = function () {
            socket.emit('mageSelect', {
                charId: 'mage',
                state: true
            });
            //charSelDiv.style.display = 'none';
            //gameDiv.style.display = 'inline-block';
        }
        char3.onclick = function () {
            socket.emit('rangerSelect', {
                charId: 'ranger',
                state: true
            });
            //charSelDiv.style.display = 'none';
            //gameDiv.style.display = 'inline-block';
        }
        char4.onclick = function () {
            socket.emit('paladinSelect', {
                charId: 'paladin',
                state: true
            });
            //charSelDiv.style.display = 'none';
            //gameDiv.style.display = 'inline-block';
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        socket.on('charChoosen', function (data) {
            if (data.hasChar) {
                charSelDiv.style.display = 'none';
                gameDiv.style.display = 'inline-block';
            } else {
                alert("Please Select a Character.");
            }
        });
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // UI
        //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
        var changeMap = function () {
            console.log('change');
            socket.emit('changeMap');
        }
        // Game
        //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
        // Draw Images
        var Img = {};
        var avatars = ['/public/img/player.png', '/public/img/fighter.png', '/public/img/ranger.png']
        Img.player = new Image();
        Img.player.src = avatars[Math.floor(Math.random() * avatars.length)];
        Img.fighter = new Image();
        Img.fighter.src = '/public/img/fighter.png';
        Img.bullet = new Image();
        Img.bullet.src = '/public/img/bullet.png';
        Img.sword = new Image();
        Img.sword.src = '/public/img/sword.png';
        Img.map = {};
        Img.map['field'] = new Image();
        Img.map['field'].src = '/public/img/reverieArena.png';
        Img.map['forest'] = new Image();
        Img.map['forest'].src = '/public/img/map2.png';
        // Initialization Package
        // New palyer / attacks created
        var ctx = document.getElementById("ctx").getContext("2d");
        var ctxUi = document.getElementById("ctx-ui").getContext("2d");
        ctxUi.font = '30px Arial';
        var Player = function (initPack) {
            var self = {};
            self.id = initPack.id;
            self.number = initPack.number;
            self.x = initPack.x;
            self.y = initPack.y;
            self.hp = initPack.hp;
            self.hpMax = initPack.hpMax;
            self.score = initPack.score;
            self.map = initPack.map;
            console.log('MAGE', initPack);
            self.draw = function () {
                if (Player.list[selfId].map !== self.map) {
                    return;
                }
                var x = self.x - Player.list[selfId].x + WIDTH / 2;
                var y = self.y - Player.list[selfId].y + HEIGHT / 2;
                var hpWidth = 30 * self.hp / self.hpMax;
                ctx.fillStyle = 'red';
                ctx.fillRect(x - hpWidth / 2, y - 40, hpWidth, 4);
                var width = Img.player.width;
                var height = Img.player.height;
                ctx.drawImage(Img.player,
                    0, 0, Img.player.width, Img.player.height,
                    x - width / 2, y - height / 2, width, height);
            }
            Player.list[self.id] = self;
            return self;
        }
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var Fighter = function (initPack) {
            var self = {};
            self.id = initPack.id;
            self.number = initPack.number;
            self.x = initPack.x;
            self.y = initPack.y;
            self.hp = initPack.hp;
            self.hpMax = initPack.hpMax;
            self.score = initPack.score;
            self.map = initPack.map;
            console.log('FIGHTER', initPack);
            self.draw = function () {
                if (Player.list[selfId].map !== self.map) {
                    return;
                }
                var x = self.x - Player.list[selfId].x + WIDTH / 2;
                var y = self.y - Player.list[selfId].y + HEIGHT / 2;
                var hpWidth = 30 * self.hp / self.hpMax;
                ctx.fillStyle = 'red';
                ctx.fillRect(x - hpWidth / 2, y - 40, hpWidth, 4);
                var width = Img.player.width;
                var height = Img.player.height;
                ctx.drawImage(Img.player,
                    0, 0, Img.player.width, Img.player.height,
                    x - width / 2, y - height / 2, width, height);
            }
            Player.list[self.id] = self;
            return self;
        }
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var Ranger = function (initPack) {
            var self = {};
            self.id = initPack.id;
            self.number = initPack.number;
            self.x = initPack.x;
            self.y = initPack.y;
            self.hp = initPack.hp;
            self.hpMax = initPack.hpMax;
            self.score = initPack.score;
            self.map = initPack.map;
            console.log('Ranger', initPack);
            self.draw = function () {
                if (Player.list[selfId].map !== self.map) {
                    return;
                }
                var x = self.x - Player.list[selfId].x + WIDTH / 2;
                var y = self.y - Player.list[selfId].y + HEIGHT / 2;
                var hpWidth = 30 * self.hp / self.hpMax;
                ctx.fillStyle = 'red';
                ctx.fillRect(x - hpWidth / 2, y - 40, hpWidth, 4);
                var width = Img.player.width;
                var height = Img.player.height;
                ctx.drawImage(Img.fighter,
                    0, 0, Img.player.width, Img.player.height,
                    x - width / 2, y - height / 2, width, height);
            }
            Player.list[self.id] = self;
            return self;
        }
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var Paladin = function (initPack) {
            var self = {};
            self.id = initPack.id;
            self.number = initPack.number;
            self.x = initPack.x;
            self.y = initPack.y;
            self.hp = initPack.hp;
            self.hpMax = initPack.hpMax;
            self.score = initPack.score;
            self.map = initPack.map;
            console.log('Paladin', initPack);
            self.draw = function () {
                if (Player.list[selfId].map !== self.map) {
                    return;
                }
                var x = self.x - Player.list[selfId].x + WIDTH / 2;
                var y = self.y - Player.list[selfId].y + HEIGHT / 2;
                var hpWidth = 30 * self.hp / self.hpMax;
                ctx.fillStyle = 'red';
                ctx.fillRect(x - hpWidth / 2, y - 40, hpWidth, 4);
                var width = Img.player.width;
                var height = Img.player.height;
                ctx.drawImage(Img.player,
                    0, 0, Img.player.width, Img.player.height,
                    x - width / 2, y - height / 2, width, height);
            }
            Player.list[self.id] = self;
            return self;
        }
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Player.list = {};
        var Bullet = function (initPack) {
            var self = {};
            self.id = initPack.id;
            self.x = initPack.x;
            self.y = initPack.y;
            self.map = initPack.map;
            self.draw = function () {
                if (Player.list[selfId].map !== self.map) {
                    return;
                }
                var width = Img.bullet.width / 2;
                var height = Img.bullet.height / 2;
                var x = self.x - Player.list[selfId].x + WIDTH / 2;
                var y = self.y - Player.list[selfId].y + HEIGHT / 2;
                ctx.drawImage(Img.bullet,
                    0, 0, Img.bullet.width, Img.bullet.height,
                    x - width / 2, y - height / 2, width, height);
            }
            Bullet.list[self.id] = self;
            return self;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var Sword = function (initPack) {
            var self = {};
            self.id = initPack.id;
            self.x = initPack.x;
            self.y = initPack.y;
            self.map = initPack.map;
            self.draw = function () {
                if (Player.list[selfId].map !== self.map) {
                    return;
                }
                var width = Img.bullet.width / 2;
                var height = Img.bullet.height / 2;
                var x = self.x - Player.list[selfId].x + WIDTH / 2;
                var y = self.y - Player.list[selfId].y + HEIGHT / 2;
                ctx.drawImage(Img.sword,
                    0, 0, Img.sword.width, Img.sword.height,
                    x - width / 2, y - height / 2, width, height);
            }
            Bullet.list[self.id] = self;
            return self;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var Arrow = function (initPack) {
            var self = {};
            self.id = initPack.id;
            self.x = initPack.x;
            self.y = initPack.y;
            self.map = initPack.map;
            self.draw = function () {
                if (Player.list[selfId].map !== self.map) {
                    return;
                }
                var width = Img.bullet.width / 2;
                var height = Img.bullet.height / 2;
                var x = self.x - Player.list[selfId].x + WIDTH / 2;
                var y = self.y - Player.list[selfId].y + HEIGHT / 2;
                ctx.drawImage(Img.sword,
                    0, 0, Img.sword.width, Img.sword.height,
                    x - width / 2, y - height / 2, width, height);
            }
            Bullet.list[self.id] = self;
            return self;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var Spear = function (initPack) {
            var self = {};
            self.id = initPack.id;
            self.x = initPack.x;
            self.y = initPack.y;
            self.map = initPack.map;
            self.draw = function () {
                if (Player.list[selfId].map !== self.map) {
                    return;
                }
                var width = Img.bullet.width / 2;
                var height = Img.bullet.height / 2;
                var x = self.x - Player.list[selfId].x + WIDTH / 2;
                var y = self.y - Player.list[selfId].y + HEIGHT / 2;
                ctx.drawImage(Img.sword,
                    0, 0, Img.sword.width, Img.sword.height,
                    x - width / 2, y - height / 2, width, height);
            }
            Bullet.list[self.id] = self;
            return self;
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Bullet.list = {};
        // Create new player & Bullets
        var selfId = null;
        socket.on('init', function (data) {
            //console.log(data);
            if (data.selfId) {
                selfId = data.selfId;
            }
            for (var i = 0; i < data.player.length; i++) {
                new Player(data.player[i]);
            }
            for (var i = 0; i < data.bullet.length; i++) {
                new Bullet(data.bullet[i]);
            }
        });
        socket.on('initf', function (data) {
            //console.log(data);
            if (data.selfId) {
                selfId = data.selfId;
            }
            for (var i = 0; i < data.player.length; i++) {
                new Fighter(data.player[i]);
            }
            for (var i = 0; i < data.bullet.length; i++) {
                new Sword(data.bullet[i]);
            }
        });
        socket.on('initr', function (data) {
            //console.log(data);
            if (data.selfId) {
                selfId = data.selfId;
            }
            for (var i = 0; i < data.player.length; i++) {
                new Ranger(data.player[i]);
            }
            for (var i = 0; i < data.bullet.length; i++) {
                new Arrow(data.bullet[i]);
            }
            console.log(data);
        });
        socket.on('initp', function (data) {
            //console.log(data);
            if (data.selfId) {
                selfId = data.selfId;
            }
            for (var i = 0; i < data.player.length; i++) {
                new Paladin(data.player[i]);
            }
            for (var i = 0; i < data.bullet.length; i++) {
                new Spear(data.bullet[i]);
            }
        });
        // Update Package
        // Changes / Differences
        // Loop through players and bullets
        socket.on('update', function (data) {
            for (var i = 0; i < data.player.length; i++) {
                var pack = data.player[i];
                var p = Player.list[pack.id];
                if (p) {
                    if (pack.x !== undefined) {
                        p.x = pack.x;
                    };
                    if (pack.y !== undefined) {
                        p.y = pack.y;
                    };
                    if (pack.hp !== undefined) {
                        p.hp = pack.hp;
                    };
                    if (pack.score !== undefined) {
                        p.score = pack.score;
                    };
                    if (pack.map !== undefined) {
                        p.map = pack.map;
                    };
                }
            }
            for (var i = 0; i < data.bullet.length; i++) {
                var pack = data.bullet[i];
                var b = Bullet.list[data.bullet[i].id];
                if (b) {
                    if (pack.x !== undefined) {
                        b.x = pack.x;
                    };
                    if (pack.y !== undefined) {
                        b.y = pack.y;
                    };
                }
            }
        });
        // Remove Package
        // Notify Client when player / attack is removed
        socket.on('remove', function (data) {
            for (var i = 0; i < data.player.length; i++) {
                delete Player.list[data.player[i]];
            }
            for (var i = 0; i < data.bullet.length; i++) {
                delete Bullet.list[data.bullet[i]];
            }
        });
        setInterval(function () {
            if (!selfId) {
                return;
            }
            ctx.clearRect(0, 0, 500, 500);
            drawMap();
            drawScore();
            for (var i in Player.list) {
                Player.list[i].draw();
            }
            for (var i in Bullet.list) {
                Bullet.list[i].draw();
            }
        }, 40);
        var drawMap = function () {
            var player = Player.list[selfId];
            var x = WIDTH / 2 - player.x;
            var y = HEIGHT / 2 - player.y;
            ctx.drawImage(Img.map[player.map], x, y);
        }
        var drawScore = function () {
            if (lastScore === Player.list[selfId].score)
                return;
            lastScore = Player.list[selfId].score;
            ctxUi.clearRect(0, 0, 500, 500);
            ctxUi.fillStyle = 'white';
            ctxUi.fillText(Player.list[selfId].score, 0, 30);
        }
        var lastScore = null;
        // Controlling player > MOVEMENT
        document.onkeydown = function (event) {
            // D
            if (event.keyCode === 68)
                socket.emit('keyPress', {
                    inputId: 'right',
                    state: true
                });
            // S
            else if (event.keyCode === 83)
                socket.emit('keyPress', {
                    inputId: 'down',
                    state: true
                });
            // A
            else if (event.keyCode === 65) socket.emit('keyPress', {
                inputId: 'left',
                state: true
            });
            // W
            else if (event.keyCode === 87) socket.emit('keyPress', {
                inputId: 'up',
                state: true
            });
        }
        document.onkeydown = function (event) {
            // D
            if (event.keyCode === 68)
                socket.emit('keyPress', {
                    inputId: 'right',
                    state: true
                });
            // S
            else if (event.keyCode === 83)
                socket.emit('keyPress', {
                    inputId: 'down',
                    state: true
                });
            // A
            else if (event.keyCode === 65) socket.emit('keyPress', {
                inputId: 'left',
                state: true
            });
            // W
            else if (event.keyCode === 87) socket.emit('keyPress', {
                inputId: 'up',
                state: true
            });
        }
        document.onkeyup = function (event) {
            // D
            if (event.keyCode === 68) socket.emit('keyPress', {
                inputId: 'right',
                state: false
            });
            // S
            else if (event.keyCode === 83) socket.emit('keyPress', {
                inputId: 'down',
                state: false
            });
            // A
            else if (event.keyCode === 65) socket.emit('keyPress', {
                inputId: 'left',
                state: false
            });
            // W
            else if (event.keyCode === 87) socket.emit('keyPress', {
                inputId: 'up',
                state: false
            });
        }
        // Controlling player > ATTACK
        document.onmousedown = function (event) {
            socket.emit('keyPress', {
                inputId: 'attack',
                state: true
            });
        }
        document.onmouseup = function (event) {
            socket.emit('keyPress', {
                inputId: 'attack',
                state: false
            });
        }
        document.onmousemove = function (event) {
            var x = -250 + event.clientX - 8;
            var y = -250 + event.clientY - 8;
            var angle = Math.atan2(y, x) / Math.PI * 180;
            socket.emit('keyPress', {
                inputId: 'mouseAngle',
                state: angle
            });
        }
        document.oncontextmenu = function (event) {
            event.preventDefault();
        }
