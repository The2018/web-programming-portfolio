var Missle = function(x, y){
	this.type = OBJECT_MISSLE;
	this.opposingtype = [OBJECT_ENEMY];

	this.image = SpriteSheet.image;
	this.sx = SpriteSheet.map['missle'].sx;
	this.sy = SpriteSheet.map['missle'].sy;
	this.w = SpriteSheet.map['missle'].w;
	this.h = SpriteSheet.map['missle'].h;

	this.x = x;
	this.y = y;
	this.vy = -500;

	Missle.prototype.draw = function(ctx){
		ctx.drawImage(this.image, this.sx, this.sy, this.w, this.h, this.x, this.y, this.w, this.h);
	}

	Missle.prototype.update = function(dt){
		this.y += this.vy * dt;

		// if (this.board.collide(this, OBJECT_ENEMY)){
		// 	this.board.markRemove(this);
		// 	this.board.collide(this, OBJECT_ENEMY).hit();
		// 	Game.score += 1;
		// }
		if (this.y < -this.h){
			this.board.markRemove(this);
		}
	}
}