function searchMap(){
		var updateWindow = document.getElementById("update");
		var mapWindow = document.createElement("div");
		mapWindow.setAttribute("class","clearfix");
		
		var title = document.createElement("h1");
		title.innerHTML = "Weather Map";

		mapWindow.appendChild(document.createElement("hr"));
		mapWindow.appendChild(title);

		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext && canvas.getContext("2d");
		
		canvas.setAttribute("width", 1085);
		canvas.setAttribute("height", 582);
		canvas.setAttribute("id", "map");
		mapWindow.appendChild(canvas);

		updateWindow.appendChild(mapWindow);

		var image = new Image();
		image.src = "./img/map.png";
		image.onload = function(){
			ctx.drawImage(image,0,0,1085,582);
		}

		for (var i=0; i < 90; i+=30){
			for (var j=0; j < 180; j+=60){
				searchTemp(i,j);
			}
		}
}

function searchTemp(i,j){
	var url = "https://api.openweathermap.org/data/2.5/weather?lat="+i+"&lon="+j+"&callback=request&appid=cf9c92d100b847d59baeb5661fa5be5f";

	var newScript = document.createElement("script");
	newScript.setAttribute("src", url);
	newScript.setAttribute("id", "searchMap");

	var head = document.getElementsByTagName("head")[0];
	head.appendChild(newScript);
}

function request(data){
	var canvas = document.getElementById("map");
	var ctx = canvas.getContext && canvas.getContext("2d");
	
	if (data.main.temp-273.15 > 0){
		var color = (data.main.temp-273.15).toFixed(0)/40*255;
		ctx.fillStyle = "rgb("+color+",0,0)";
	}else if (data.main.temp-273.15 < 0){
		var color = (data.main.temp-273.15).toFixed(0)/40*255;
		ctx.fillStyle = "rgb(0,0"+color+")";
	}
		console.log(color, data.coord["lon"], data.coord["lat"]);

	ctx.fillRect(data.coord["lon"]*3+250,data.coord["lat"]*3+250,10,10);
}