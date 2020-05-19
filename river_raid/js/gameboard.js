var Gameboard = function(title, subtitle){
	this.img = new Image();
	this.img.src = 'img/battleground.png';
	this.img.onload = this.draw;

	this.objects = [];
	this.objectsToRemove = [];

	this.scrollSpeed = 4;
	this.y = Game.canvas.height * 2;
	this.count = 0;
	this.end = 0;

	// this.score = 0;

	this.add = function(obj){
		obj.board = this;
		this.objects.push(obj);
	}

	this.markRemove = function(obj){
		if (this.objects.indexOf(obj) != -1){
			this.objectsToRemove.push(obj);
		}
	}

	this.remove = function(){
		for (var i = 0; i < this.objectsToRemove.length; i++){
			var index = this.objects.indexOf(this.objectsToRemove[i]);
			if (index != -1){
				if (this.objectsToRemove[i].type == OBJECT_ENEMY && this.end == 0){
					this.add(new Enemy(enemyTypes.basic,{x:Math.random()*Game.canvas.width, y:Math.random()*0.2*Game.canvas.height}))
				}
				this.objects.splice(index, 1);
			}
		}
	}

	this.resetRemove = function(){
		this.objectsToRemove = [];
	}

	this.overlap = function(o1, o2){
		return (!((o1.x+o1.w<o2.x)||(o1.x>o2.x+o2.w)||(o1.y+o1.h<o2.y)||(o1.y>o2.y+o2.h)))
	}

	// this.collide = function(obj, opposingtype){
	// 	for (var i = 0; i < this.objects.length; i++){
	// 		var opponent = this.objects[i];
	// 		if (obj != opponent){
	// 			if (this.overlap(opponent, obj) && (!opposingtype || opponent.type === opposingtype))
	// 				return opponent;
	// 		}
	// 	}
	// 	return false;
	// }

	this.collide = function(){
		for (var i = 0; i < this.objects.length; i++){
			for (var j = i+1; j < this.objects.length; j++){
				if (this.overlap(this.objects[i], this.objects[j]) && (this.objects[i].opposingtype.indexOf(this.objects[j].type) != -1)){
					this.markRemove(this.objects[i]);
					this.markRemove(this.objects[j]);
					if (this.objects[i].type == OBJECT_ENEMY && this.objects[j].type == OBJECT_MISSLE)
						Game.score += 1;
					if (this.objects[i].type == OBJECT_PLAYER && this.objects[j].type == OBJECT_ENEMY)
						this.end = 1;
				}
			}
		}
	}

	this.iterate = function(funcName){
		var args = Array.prototype.slice.call(arguments,1);
		for (var i=0, len=this.objects.length; i<len; i++){
			var obj = this.objects[i];
			obj[funcName].apply(obj, args);
		}
	}

	this.draw = function(ctx) {
		ctx.drawImage(this.img, 0, this.y, 350, 584, 0, 0, 350, 584);
		// ctx.fillStyle = "#FFFFFF";
		// ctx.textAlign = "center";
		// ctx.font = "bold 3em bangers";
		// ctx.fillText(title,Game.width/2,Game.height/2);

		// ctx.font = "bold 2em bangers";
		// ctx.fillText(this.score,Game.width/2,Game.height/2 + 40);
		this.iterate('draw', ctx);
	}


	this.update = function(dt){
		this.resetRemove();
		this.iterate('update', dt);
		this.collide();

		if (this.y == Game.canvas.height && this.count <= 1){
			this.y = Game.canvas.height * 2;
			this.count += 1;
		}
		else if (this.y == Game.canvas.height && this.count >= 1){
			this.y = Game.canvas.height;
		} 
		if (this.count <= 2 && this.y > 0)
			this.y -= this.scrollSpeed;
		else {
			this.y = 0;
			for (var i; i < this.objects.length; i++){
				if (this.objects[i].type == OBJECT_ENEMY){
					this.objects[i].markRemove();
				}
			}
			this.end = 1;
			// Game.score = this.score;
		}

		this.remove();
	}
}