var Enemy = function(common, specific){
	for (var prop in common){
		this[prop] = common[prop];
	}

	if (specific){
		for (prop in specific){
			this[prop] = specific[prop];
		}
	}

	this.type = OBJECT_ENEMY;
	this.opposingtype = [OBJECT_MISSLE, OBJECT_PLAYER];

	this.w = SpriteSheet.map[this.name].w;
	this.h = SpriteSheet.map[this.name].h;
	this.frame_id  = 0;
	this.frame_type = 0;
	this.image = SpriteSheet.image;
	this.t = 0;
	this.vy = 4;
	this.direction = 1;

	this.hit = function(){
		this.board.markRemove(this);
	}

	Enemy.prototype.update = function(dt){
		this.t += dt;
		this.vx = 50 * this.direction; 
		this.x += this.vx * dt;
		this.y += this.vy;

		if (this.frame_type == 0){
			this.frame_id += 0.2;
		}
		else if (this.frame_type == 1){
			this.frame_id -= 0.2;
		}

		if (this.frame_id >= SpriteSheet.map[this.name].frame){
			this.frame_type = 1;
		}
		else if (this.frame_id <= 0){
			this.frame_type = 0;
		}
		this.sx = Math.floor(this.frame_id)*this.w;

		if (this.x >= Game.width - 100){
			this.direction = -1;
			this.sy = 207;
		} else if (this.x <= 40){
			this.direction = 1;
			this.sy = 0;
		}

		if (this.y >= Game.height){
			this.hit();
		}
	}

	Enemy.prototype.draw = function(ctx){
		ctx.drawImage(this.image, this.sx, this.sy, this.w, this.h, 
			this.x, this.y, this.w, this.h);
		// SpriteSheet.draw(ctx, this.name, this.x, this.y, this.frame_id);
	}
}