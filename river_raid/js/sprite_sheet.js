var canvas = document.getElementById("game_canvas");
var width = canvas.width;
var height = canvas.height;

var ctx = canvas.getContext && canvas.getContext('2d');
var imageArr = Array();
var srcArr = ['img/ship.png', 'img/explosion.png', 'img/plane.png', 'img/ships.png'];

for (var i = 0; i < 4; i++){
	imageArr[i] = new Image();
	imageArr[i].src = srcArr[i];
}

window.onload = draw;

function draw(){
	for (var i = 0; i < 600;i += 56){
		ctx.drawImage(imageArr[0], i, 140, 66, 60, i, 0, 66, 80);
	}
	for (var i = 0; i < 567; i += 63){
		ctx.drawImage(imageArr[1], i, 73, 58, 47, i, 90, 58, 47);
	}
	ctx.drawImage(imageArr[3], 50, 300, 200, 176, 0, 137, 80, 70);
	ctx.drawImage(imageArr[3], 280, 395, 186, 100, 70, 137, 70, 33);

	ctx.translate(560, 100);
	ctx.scale(-1, 1);
	ctx.drawImage(imageArr[0], 0, 140, 600, 60, 0, 110, 600, 80);
	ctx.setTransform(1, 0, 0, 1, 0, 0);

}