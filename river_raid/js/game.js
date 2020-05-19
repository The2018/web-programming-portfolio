window.addEventListener("load", function(){
	Game.initialize('game_canvas', sprites, startGame)
})

var sprites = {
	plane: {sx: 0, sy: 137, w: 80, h: 70, frame: 1},
	ship: {sx: 0, sy: 0, w: 62, h: 80, frame: 9},
	explosion: {sx: 0, sy: 90, w: 58, h: 47, frame: 1}, 
	missle: {sx: 70, sy: 137, w: 70, h: 33, frame: 1}
}

var OBJECT_PLAYER = 1;
var OBJECT_MISSLE = 2;
var OBJECT_ENEMY = 3;
var OBJECT_EXPLOSION = 4;

var Titlescreen = function(title, subtitle){
	this.img = new Image();
	this.img.src = 'img/entry.png';
	this.img.onload = this.draw;

	this.draw = function(ctx) {
		ctx.drawImage(this.img, 0, 0, 350, 584);
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.font = "bold 3em bangers";
		ctx.fillText(title,Game.width/2,Game.height/2);

		ctx.font = "bold 2em bangers";
		ctx.fillText(subtitle,Game.width/2,Game.height/2 + 40);
	}
}



var SpriteSheet = new function() {
  this.map = { }; 

  this.load = function(spriteData,callback) { 
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'img/sprites.png';
  };

  this.draw = function(ctx,sprite,x,y,frame) {
    var s = this.map[sprite];
    if(!frame) frame = 0;
    ctx.drawImage(this.image,
                     s.sx + frame * s.w, 
                     s.sy, 
                     s.w, s.h, 
                     Math.floor(x), Math.floor(y),
                     s.w, s.h);
  };
};

var EndScreen = function(title, score){
	this.img = new Image();
	this.img.src = 'img/endScreen.jpg';
	this.img.onload = this.draw;

	this.draw = function(ctx) {
		ctx.drawImage(this.img, 0, 0, 350, 584);
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.font = "bold 3em bangers";
		ctx.fillText(title,Game.width/2,Game.height/2);

		ctx.font = "bold 2em bangers";
		ctx.fillText("Score: "+score,Game.width/2,Game.height/2 + 40);
	}
}

var startGame = function(){
	Game.setScreen(0, new Titlescreen("River Raid", "press space to start"));
}

var enemyTypes = {
	basic: {name:'ship', sx: 0, sy: 0, w: 66, h: 80}
}

var playGame = function(){
	var board = new Gameboard("Middle screen", "press enter to end");
	board.add(new Player());
	board.add(new Enemy(enemyTypes.basic,{x:50, y:100}));
	board.add(new Enemy(enemyTypes.basic,{x:90, y:230}));
	Game.setScreen(1, board);
}

var endGame = function(score){
	Game.setScreen(2, new EndScreen("Game over", score));
}

var Game = new function(){
	this.screens = [];
	this.keys = [];
	var KEY_CODES = {37:'left', 39:'right', 32:'space', 13:'enter'};
	this.active_screens = 0;
	this.score = 0;

	this.initialize = function(canvasID, sprite_data, callback){
		this.canvas = document.getElementById(canvasID);
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
		if (!this.ctx){
			return alert("Please upgrade your browser to play");
		}

		this.setupInput();

		this.loop();

		SpriteSheet.load(sprite_data, callback);
	};

	this.setupInput = function(){
		window.addEventListener("keydown",function(e){
			if(KEY_CODES[e.keyCode]) {
				Game.keys[KEY_CODES[e.keyCode]] = true;
				e.preventDefault();
			}
		}, false);

		window.addEventListener('keyup',function(e) {
			if(KEY_CODES[e.keyCode]) {
				Game.keys[KEY_CODES[e.keyCode]] = false;
				e.preventDefault();
			}
		},false);
	};

	this.loop = function(){
		var dt = 50/1000;

		if (Game.keys['space']&&Game.active_screens == 0){
			playGame();
			Game.active_screens = 1;
		};

		if (((Game.screens[1]&& Game.screens[1].end == 1 ) || Game.keys['enter'])&&Game.active_screens == 1){
			endGame(Game.score);
			Game.active_screens = 1;
		};

		for (var i=0; i < Game.screens.length; i++){
			if (Game.screens[i]){
				Game.screens[i].update && Game.screens[i].update(dt);
				Game.screens[i].draw && Game.screens[i].draw(Game.ctx);
			}
		}
		setTimeout(Game.loop, 50);
	};

	this.setScreen = function(num, screen){
		this.screens[num] = screen;
	};
}	