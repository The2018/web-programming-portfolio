function forecast(data){
	if (!document.getElementById(data.city.name+" forecast")){
		var totalWindow = document.getElementById(data.city.name);

		var forecastWindow = document.createElement("div");
		forecastWindow.setAttribute("class","clearfix");
		forecastWindow.setAttribute("id",data.city.name+" forecast");

		var canvas = document.createElement("canvas");
		canvas.height = 300;
		canvas.width = 600;
		var ctx = canvas.getContext("2d");

		drawAxes(20,canvas.height-80,canvas.width, ctx);

		var ls = data.list;
		var temp = new Array();
		var dateTime = new Array();
		var weather = new Array();

		for (var i=0; i < ls.length; i++){
			temp.push((JSON.stringify(ls[i].main.temp)-273.15).toFixed(2));
			dateTime.push(JSON.stringify(ls[i].dt_txt));
			weather.push(JSON.stringify(ls[i].weather[0].icon));
		}

		var date = dateTime[0].split(" ")[0];
		var average = new Array();
		var dates = [date];
		var count = 1;
		var sum = parseFloat(temp[0]);
		var icons = new Array();
		var daily_icon = {};
		daily_icon[weather[0]] = 1;

		for (var i=1; i < temp.length; i++){
			if (dateTime[i].split(" ")[0]!=date){
				average.push((sum/count).toFixed(1));
				dates.push(dateTime[i].split(" ")[0]);
				date = dateTime[i].split(" ")[0];
				var best_so_far = [weather[0],0];
				for (var key in daily_icon){
					console.log(key);
					if (daily_icon[key]>best_so_far[1]){
						// key = key.slice(1,-1);
						best_so_far = [key.slice(1,-1),daily_icon[key]];
						console.log(best_so_far);
					}
				}
				icons.push(best_so_far[0]);
				count = 0;
				sum = 0;
			}
			else{
				count += 1;
				sum += parseFloat(temp[i]);
				if (daily_icon[weather[i]]){
					daily_icon[weather[i]] += 1;
				}else{
					daily_icon[weather[i]] = 1;
				}
			}
		}
		console.log(daily_icon);
		drawBars(average, dates, icons,20,canvas.height-80,canvas.width, ctx)

		var title = document.createElement("h1");
		title.innerHTML = "Forecast";

		forecastWindow.appendChild(document.createElement("hr"));
		forecastWindow.appendChild(title);
		forecastWindow.appendChild(canvas);

		totalWindow.appendChild(forecastWindow);
	}
}

function drawAxes(baseX, baseY, chartWidth, _ctx) {
		   var leftY, rightX;
		   leftY = 5;
		   rightX = baseX + chartWidth;

		   _ctx.moveTo(baseX, leftY);
		   _ctx.lineTo(baseX, baseY);

		   _ctx.moveTo(baseX, leftY);
		   _ctx.lineTo(baseX + 5, leftY + 5);
		   _ctx.moveTo(baseX, leftY);
		   _ctx.lineTo(baseX - 5, leftY + 5);

		   _ctx.moveTo(baseX, baseY);
		   _ctx.lineTo(rightX - 30, baseY);

		   _ctx.moveTo(rightX - 30, baseY);
		   _ctx.lineTo(rightX - 35, baseY + 5);
		   _ctx.moveTo(rightX - 30, baseY);
		   _ctx.lineTo(rightX - 35, baseY - 5);

		   _ctx.strokeStyle = "#000";
		   _ctx.stroke();

		   // _ctx.font = "bold 18px sans-serif";
		   // _ctx.fillText("temperature", 0, (baseY+20)/2);
}

function drawBars(averages,dates,icons,baseX, baseY, chartWidth, _ctx){
	var barWidth = 40;
	var xPos = baseX + 30;
	for (var i=0; i < averages.length; i++) {
	   date = dates[i];
	   height = averages[i]/35*baseY;
	   _ctx.fillRect(xPos, baseY-height, barWidth, height);
	   _ctx.font = "bold 18px sans-serif";
	   _ctx.fillText(averages[i],xPos,baseY-height-10);
	   _ctx.fillText(dates[i].slice(6),xPos-5,baseY+20);
	   var img = document.createElement("img");
	   var src = "http://openweathermap.org/img/wn/"+icons[i]+"@2x.png";
	   img.setAttribute("src",src);
	   _ctx.drawImage(img,xPos-30,baseY);   
	   xPos += 100;
	}
	console.log(icons);
}