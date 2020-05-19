var Player = function(){
	this.type = OBJECT_PLAYER;
	this.opposingtype = [OBJECT_ENEMY];

	this.w = SpriteSheet.map['plane'].w;
	this.h = SpriteSheet.map['plane'].h;
	this.sx = SpriteSheet.map['plane'].sx;
	this.sy = SpriteSheet.map['plane'].sy;

	this.x = Game.canvas.width / 2 - this.w / 2;
	this.y = Game.canvas.height - this.h;
	this.vx = 60;
	this.direction = 1;

	this.image = SpriteSheet.image;

	this.FirePeriod = 0.25;
	this.timeToFire = this.FirePeriod;

	this.draw = function(ctx){
		ctx.drawImage(this.image, this.sx, this.sy, this.w, this.h, this.x, this.y, this.w, this.h);
	}

	this.update = function(dt){
		this.t += dt;
		this.timeToFire -= dt;

		// if (this.board.collide(this, OBJECT_ENEMY)){
		// 	this.board.markRemove(this);
		// 	this.board.end = 1;
		// }

		if (Game.keys['left']){
			this.direction = -1;
		}
		else if (Game.keys['right']){
			this.direction = 1;
		} else{
			this.direction = 0;
		}

		if (Game.keys['space'] && this.timeToFire <= 0){
			Game.keys['space'] = false;
			this.timeToFire = this.FirePeriod;
			this.board.add(new Missle(this.x-8, this.y));
		}

		this.x += this.vx * this.direction * dt;
	}
}