window.onload = draw;

function drawCircle(ctx, x, y){
	ctx.beginPath();
	ctx.arc(x, y, 5, 0, Math.PI*2);
	ctx.fillStyle = "white";
	ctx.fill();
}

function draw(){
	var canvas = document.getElementById('gamecanvas');
	var ctx = canvas.getContext && canvas.getContext('2d');

	var span = document.getElementById("quit");
	span.addEventListener("click", clearCanvas, false);

	var coordinates = new Array();
	for (var i = 0; i < 24; i++){
		var x = Math.random() * 800;
		var y = Math.random() * 450;
		coordinates[i] = [x,y];
		drawCircle(ctx, x, y);
	}

	var color = ["orange", "blue"];
	for (var i = 0; i < 2; i++){
		ctx.beginPath();
		ctx.arc(coordinates[i][0], coordinates[i][1], 20, 0, Math.PI*2);
		ctx.strokeStyle = color[i];
		ctx.lineWidth = 5;
		ctx.stroke();
	}

	var player1_arr = [0, 3, 5];
	var player2_arr = [1, 4, 19, 7, 13];
	for (var i = 0; i < player1_arr.length-1; i++){
		ctx.beginPath();
		ctx.moveTo(coordinates[player1_arr[i]][0], coordinates[player1_arr[i]][1]);
		ctx.lineTo(coordinates[player1_arr[i+1]][0], coordinates[player1_arr[i+1]][1]);
		console.log(player1_arr[i]);
		ctx.strokeStyle = "orange";
		ctx.lineWidth = 5;
		ctx.stroke();
	}

	for (var i = 0; i < player2_arr.length-1; i++){
		ctx.beginPath();
		ctx.moveTo(coordinates[player2_arr[i]][0], coordinates[player2_arr[i]][1]);
		ctx.lineTo(coordinates[player2_arr[i+1]][0], coordinates[player2_arr[i+1]][1]);
		console.log(player2_arr[i]);
		ctx.strokeStyle = "blue";
		ctx.lineWidth = 5;
		ctx.stroke();
	}
}



function clearCanvas(){
	var canvas = document.getElementById('gamecanvas');
	var ctx = canvas.getContext && canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "center";
	ctx.font = "bold 3em bangers";
	ctx.fillText("Game over",canvas.width/2,canvas.height/2);
}