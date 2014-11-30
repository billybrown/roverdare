
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var canvas, ctx;
var middleHeight = windowWidth/2;
var middleWidth = windowHeight/2;

// create the canvas
function createCanvas() {
	canvas = document.getElementById("game");
	ctx = canvas.getContext("2d");
	ctx.canvas.width = windowWidth;
	ctx.canvas.height = windowHeight;
	ctx.fillStyle = '#000000';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	initStars(stars);
	initStars(stars_2);
}

var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	renderStars();
	renderMars();
	renderRover();
	renderScore();
	renderPowerStars();
	then = now;
};


// game objects
var rover = {
	speed: 200, //movement in pixels per second
	hyperspeed: 700,
	x: windowHeight,
	y: middleHeight,
	hyperspeedOn: false,
	appear: false,
	power: 0,
	powerup: false,
	boostersDown: false,
	boostersUp: false,
	boostersRight: false,
	boostersLeft: false,
	moveDown: false,
	moveUp: false,
	moveRight: false,
	moveLeft: false,
	gas: 100,
	color: "#2296FF",
	land: false,
	landingAttempt: false,
	landSpeed: 100,
	onMars: false,
	takeoffAttempt: false,
	returnMars: false,
	overMars: false,
	landMode: false,
	skyMode: true,
	flyinComplete: false
};
var powerStar = {
	x: 0,
	y: randomRange(100,windowWidth)
};
var mars = {
	x: -windowHeight,
	y: windowWidth/2,
	width: windowHeight,
	height: windowHeight,
	color: '#CC4400',
	appear: false,
	speed: 50,
	hide: false, 
	hideReturn: false,
	moveDown: false,
	moveUp: false,
	introDown: false,
	introDown2: true
};
var stars = new Array(512); 
var stars_2 = new Array(250);
var lightup = false;
var lightupCount = 0;
var lightupOpacity = 100;
var powerStarsCaught = 0;
var powerstar_red = '#F50072';
var tracks = new Array();
var water = new Array();
var waterTimer = 0;
var trackTimer = 50;
var intro = true;
var instructions_1_show = false;
var instructions_1_hide = false;
var instructions_2_show = false;
var instructions_2_hide = false;
var instructions_3_show = false;
var instructions_3_hide = false;
var tracksNew;

// Handle keyboard controls
var keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);



// Update game objects
var update = function (modifier) {

	if (trackTimer >= 1){
		trackTimer--;
	} else {
		trackTimer = 2;
	}


	if (rover.x <= (mars.x + mars.width) && mars.x <= (rover.x + mars.width) && rover.y <= (mars.y + mars.width) && mars.y <= (rover.y + mars.width)) {
		rover.overMars = true;
	} else {
		rover.overMars = false;
	}

	if (rover.landMode === true){
		if (84 in keysDown) {	// player presses t to take off
			if (rover.overMars){
				rover.landMode = false;
				rover.skyMode = true;
			}
		}
		if (87 in keysDown) { // player presses w to drop water
			if (instructions_2_show === true && instructions_2_hide === false) {
				$('#instructions_2').removeClass("show");
				instructions_2_hide = true;
			}
			if (instructions_3_show === false) {
				$('#instructions_3').addClass("show");
				instructions_3_show = true;
			}
			if (powerStarsCaught > 0 && waterTimer === 0) {
				waterTimer = 50;
				var waterNew = {
					y: rover.y,
					x: rover.x,
					d: 10,
					d2: 0
				};
				water.push(waterNew);
				var waterspread = randomRange(1,10);
				var direction = 1;
				var movex = rover.x;
				var movey = rover.y;
				for (var j = 0; j < waterspread; j++){
					// choose direction
					direction = randomRange(1,5);
					width = randomRange(1,20);
					if (direction == 1){
						movey +=10;
					} else if (direction == 2){
						movey -=10;
					} else if (direction == 3){
						movex -=10;
					} else if (direction == 4){
						movex +=10;
					}
					waterNew = {
						y: movey,
						x: movex,
						d: width,
						d2: 0
					};
					water.push(waterNew);
				}
				powerStarsCaught--;
			}
		} 
		if (38 in keysDown) { // Player holding up, leaving tracks
			rover.x -= rover.speed * modifier;
			if (trackTimer == 2){
				rover.onMars = true;
				tracksNew = {
					y: rover.y,
					x: rover.x +5
				};
				tracks.push(tracksNew);
			}
		}
		if (rover.overMars === true) { // if the rover is over mars move left, right and down
			if (40 in keysDown) { // Player holding down, leaving tracks
				rover.x += rover.speed * modifier;
				if (trackTimer == 2){
					tracksNew = {
						y: rover.y,
						x: rover.x - 5
					};
					tracks.push(tracksNew);
				}
			}
			if (37 in keysDown) { // Player holding left, leaving tracks
				rover.y -= rover.speed * modifier;
				if (trackTimer == 2){
					tracksNew = {
						y: rover.y + 5,
						x: rover.x
					};
					tracks.push(tracksNew);
				}
			}
			if (39 in keysDown) { // Player holding right, leaving trakcs
				rover.y += rover.speed * modifier;
				if (trackTimer == 2){
					tracksNew = {
						y: rover.y - 5,
						x: rover.x
					};
					tracks.push(tracksNew);
				}
			}		
		}
	} else if (rover.skyMode === true) { // if the rover is in the sky
		if (76 in keysDown) { // player presses L to land
			if (rover.overMars === true) {
				if (intro === true){intro = false;} // stop intro interactions
				if (mars.introDown2 === true){mars.introDown2 = false;} // stop intro interactions
				rover.skyMode = false;
				rover.landMode = true;
				mars.moveDown = false;
				mars.moveUp = false;
			}
		} 
		if (intro === false){
			if (79 in keysDown) { //player holds down o to adjust orbit
				if (instructions_3_show === true && instructions_3_hide === false) {
					$('#instructions_3').removeClass("show");
					instructions_3_hide = true;
				}
						mars.x += mars.speed * modifier;
						for(var i = 0; i < tracks.length; i++){
							tracks[i].x += mars.speed * modifier;
						}	
						for(var i2 = 0; i2 < water.length; i2++){
							water[i2].x += mars.speed * modifier;
						}
			}
			if (80 in keysDown) { //player holds down p to adjust orbit
						mars.x -= mars.speed * modifier;	
						for(var i3 = 0; i3 < tracks.length; i3++){
							tracks[i3].x -= mars.speed * modifier;
						}
						for(var i4 = 0; i4 < water.length; i4++){
							water[i4].x -= mars.speed * modifier;
						}		
			}
		} 
		if (16 in keysDown) {
			if (instructions_1_show === true && instructions_1_hide === false) {
				$('#instructions_1').removeClass("show");
				instructions_1_hide = true;
			}
			if (38 in keysDown) { // Player holding up
				rover.x -= rover.hyperspeed * modifier;
				rover.boostersUp = true;
			}
			if (40 in keysDown) { // Player holding down
				rover.x += rover.hyperspeed * modifier;
				rover.boostersDown = true;
			}
			if (37 in keysDown) { // Player holding left
				rover.y -= rover.hyperspeed * modifier;
				rover.boostersRight = true;
			}
			if (39 in keysDown) { // Player holding right
				rover.y += rover.hyperspeed * modifier;
				rover.boostersLeft = true;
			}
		} else {
			if (38 in keysDown) { // Player holding up
				rover.x -= rover.speed * modifier;
				rover.moveUp = true;
			}
			if (40 in keysDown) { // Player holding down
				rover.x += rover.speed * modifier;
				rover.moveDown = true;
			}
			if (37 in keysDown) { // Player holding left
				rover.y -= rover.speed * modifier;
				rover.moveLeft = true;
			}
			if (39 in keysDown) { // Player holding right
				rover.y += rover.speed * modifier;
				rover.moveRight = true;
			}
		}
	}

	if (rover.flyinComplete === false && rover.x >= middleWidth) {
    	rover.x -= 4;
	} else {
		rover.flyinComplete = true;
		if (instructions_1_show === false) {
			$('#instructions_1').addClass("show");
			instructions_1_show = true;
		}
	}

	if (mars.introDown === true && mars.introDown2 === true){
		mars.moveDown = true;
		mars.moveUp = false;
		if (mars.x <= -windowHeight/2){
			mars.x += mars.speed * modifier;
		} else {
			mars.introDown2 = false;
			mars.moveDown = false;
			if (instructions_2_show === false) {
				$('#instructions_2').addClass("show");
				instructions_2_show = true;
			}
		}
	}
	if (waterTimer > 0){
		waterTimer--;
	}

};

function renderMars(){
		ctx.beginPath();
		ctx.arc(mars.y,mars.x, mars.width, 0, 2 * Math.PI, false);
		ctx.fillStyle = mars.color;
		ctx.fill();
		ctx.closePath(); 

	// rover tracks
	for(var i = 0; i < tracks.length; i++){
		ctx.fillStyle = "rgba(0,0,0,.3)";
		ctx.fillRect(tracks[i].y, tracks[i].x ,3, 3);
	}

	// water
	for(var k = 0; k < water.length; k++){
		ctx.beginPath();
		ctx.arc(water[k].y, water[k].x, water[k].d2, 0, 2 * Math.PI, false);
		ctx.lineWidth = 2;
		ctx.fillStyle = '#C6D6EC';
		ctx.fill();
		ctx.closePath(); 
		if (water[k].d2 < water[k].d){
			water[k].d2++;
		}
	}
}
function renderPowerStars(){

	powerStar.x += 8;
	if ( rover.x <= (powerStar.x + 20) && powerStar.x <= (rover.x + 20) && rover.y <= (powerStar.y + 20) && powerStar.y <= (rover.y + 20)) {
		++rover.power;
		++rover.speed;
		++powerStarsCaught;
		if (powerStarsCaught >= 4){
			mars.introDown = true;
		}
		lightupCount = 200;
		rover.powerup = true;
		powerStar.x = 0;
		powerStar.y = randomRange(100,windowWidth);
	}
	else if( powerStar.x >= canvas.height ) {
		powerStar.x = 0;
		powerStar.y = randomRange(100,windowWidth);
    }
	ctx.fillStyle = powerstar_red;
	ctx.fillRect(powerStar.y - 1,powerStar.x - 1 ,3,3);
}

function renderRover(){

	// how the rover looks in space
    if (rover.skyMode === true){
    	var rings = 10;
    	for (var i=0; i < powerStarsCaught; i++){
			if (i == 3){
				// Stroked triangle
				ctx.beginPath();
				ctx.moveTo(rover.y,rover.x - 25); // top point
				ctx.lineTo(rover.y + 21,rover.x + 12.5);
				ctx.lineTo(rover.y - 21,rover.x + 12.5);
				ctx.closePath();
				ctx.strokeStyle = 'rgba(34,150,255,0.3)';
				ctx.lineWidth = 2;
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.arc(rover.y, rover.x, rings, 0, 2 * Math.PI, false);
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'rgba(34,150,255,0.3)';
			ctx.stroke();
			ctx.closePath();  
			rings += 10;    	
    	}
		if (rover.boostersUp === true){
			ctx.fillStyle = "#FFD51A";
			ctx.fillRect(rover.y - 1,rover.x + 5 ,3,20);
			rover.boostersUp = false;
		}
		if (rover.boostersDown === true){
			ctx.fillStyle = "#FFD51A";
			ctx.fillRect(rover.y - 1,rover.x - 25 ,3,20);
			rover.boostersDown = false;
		}
		if (rover.boostersRight === true){
			ctx.fillStyle = "#FFD51A";
			ctx.fillRect(rover.y + 5,rover.x - 1 ,20,3);
			rover.boostersRight = false;
		}
		if (rover.boostersLeft === true){
			ctx.fillStyle = "#FFD51A";
			ctx.fillRect(rover.y - 25,rover.x - 1 ,20,3);
			rover.boostersLeft = false;
		}    	
   		ctx.beginPath();
		ctx.arc(rover.y + 0.5, rover.x + 0.5, 4, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'black';
		ctx.fill();
		ctx.closePath();  
		rover.speed = 200;
	}

	ctx.fillStyle = rover.color;
	ctx.fillRect(rover.y - 1,rover.x -1 ,3,3);

	// how the rover looks when on land
	if (rover.landMode === true){
		ctx.fillStyle = 'black';
		ctx.fillRect(rover.y - 3,rover.x ,3,3);
		ctx.fillRect(rover.y + 3,rover.x ,3,3);
		ctx.fillRect(rover.y,rover.x - 3,3,3);
		ctx.fillRect(rover.y,rover.x + 3,3,3);
		rover.speed = 100;
	}
}

function renderBoosters(){
	ctx.fillStyle = "#FFD51A";
	ctx.fillRect(rover.y + 1,rover.x -1 ,3,3);
}

function renderScore(){
	var j = 0;
	for( var i = 1; i < powerStarsCaught + 1; i++ ) {
		ctx.beginPath();
		ctx.moveTo(30 + j , 14); // top point
		ctx.lineTo(40 + j, 30);
		ctx.lineTo(20 + j, 30);
		ctx.closePath();
		ctx.strokeStyle = powerstar_red;
		ctx.lineWidth = 2;
		ctx.stroke();
		j += 30;
	}
}

/* Returns a random number in the range [minVal,maxVal] */
function randomRange(minVal,maxVal) {
	return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
}

// initiate the stars array with correct locations
function initStars(array){
	for( var i = 0; i < array.length; i++ ) {
		array[i] = {
			x: randomRange(0,canvas.height),
			y: randomRange(0,canvas.width)
		};
	}
}

// create the stars and make them move
function renderStars(){
	// clear stars
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	// set the new star location
	for( var i = 0; i < stars.length; i++ ) {
		if (rover.landMode === true){
			stars[i].x += 1.5;
		} else {
			stars[i].x += 3;
		}
		// if star hits the bottom of the frame make it reappear at the top
		if( stars[i].x >= canvas.height ) {
          stars[i].x = 0;
    	}
	}
	// set the new star location for big stars
	for( var i2 = 0; i2 < stars_2.length; i2++ ) {
		if (rover.landMode === true){
			stars_2[i2].x += 1;
		} else {
			stars_2[i2].x += 2;
		}
		// if star hits the bottom of the frame make it reappear at the top
		if( stars_2[i2].x >= canvas.height ) {
          stars_2[i2].x = 0;
    	}
	}
	// create stars in new location
	for( var i3 = 0; i3 < stars.length; i3++ ) {
  		ctx.fillStyle='#ffffff';
		ctx.fillRect(stars[i3].y,stars[i3].x,1,1);
		// if (lightupCount > 0){
		// 	var realOpacity = lightupOpacity/100
  // 			ctx.fillStyle='rgba(255,255,255,' + realOpacity + ')';
		// 	ctx.fillRect(stars[i].y-2.5,stars[i].x -2.5,5,5);	
		// }
	}
	// if (lightupCount >= 1){ 
	// 	lightupCount--;	
	// 	lightupOpacity -= 5;
	// 	//console.log("opacity: " + lightupOpacity + " count: " + lightupCount);
	// } else {
	// 	lightupOpacity = 100;
	// }

	// create stars in new location for big stars
	for( var i4 = 0; i4 < stars_2.length; i4++ ) {
  		ctx.fillStyle='#ffffff';
		ctx.fillRect(stars[i4].y,stars_2[i4].x,2,2);
	}
}






// Let's play this game!
var then = Date.now();
setInterval(main, 24); // Execute as fast as possible






// after the page loads
$(window).load(function() {

});


// when the window resizes and only once after it resizes
$(window).resize(function () {

});


// when the page loads
$(document).ready(function() {
	// Create the canvas
	createCanvas();


  $('.control-button').click(function(){
  	  $('.controls').toggleClass('open');
  });
});
