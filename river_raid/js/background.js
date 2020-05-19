var canvas = document.getElementById('game_canvas');
var ctx = canvas.getContext && canvas.getContext('2d');

var image = new Image();
image.src = 'img/battleground.jpg';

var image2 = new Image();
image2.src = 'img/endScreen.jpg';
window.onload = draw;

function draw(){
	ctx.drawImage(image2, 0, 0, 350, 584);
	ctx.drawImage(image, 0, 584, 350, 584);
	ctx.drawImage(image, 0, 1168, 350, 584);
}