let game = [
	['', '', ''],
	['', '', ''],
	['', '', ''],
];

let active_player = "";
let elementDrop;
let stepElement = document.getElementById("step");

function changePlayer(){
	if(active_player == "cross"){
		active_player = "zero";
	} else{
		active_player = "cross";
	}

	if(active_player == "cross") { stepElement.innerHTML = "Ходят крестики"; }
	else { stepElement.innerHTML = "Ходят нолики"; }
}
changePlayer();

function clearGame(){
	active_player = "";
	changePlayer();

	game = [
		['', '', ''],
		['', '', ''],
		['', '', ''],
	];

	document.getElementById("game").innerHTML = `
		<div class="row">
			<div class="rect" y=0 x=0></div>
			<div class="rect" y=0 x=1></div>
			<div class="rect" y=0 x=2></div>
		</div>

		<div class="row">
			<div class="rect" y=1 x=0></div>
			<div class="rect" y=1 x=1></div>
			<div class="rect" y=1 x=2></div>
		</div>

		<div class="row">
			<div class="rect" y=2 x=0></div>
			<div class="rect" y=2 x=1></div>
			<div class="rect" y=2 x=2></div>
		</div>
	`;
}

function gameOver(winner){
	if(winner == "cross"){ winner = "крестики" } else { winner = "нолики" }
	clearGame();
	alert(`Конец игры, победили: ${winner}`);
}

function notWinner(){
	for(let y = 0; y < 3; y++){
		for(let x = 0; x < 3; x++){
			if(game[y][x] == ''){ return false; }
		}
	}
	return true;
}

function gameOverIF(){
	for(let y = 0; y < 3; y++){
		if(game[y][0] == game[y][1] && game[y][1] == game[y][2] && game[y][0] != ""){ gameOver(game[y][0]); }
	}

	for(let x = 0; x < 3; x++){
		if(game[0][x] == game[1][x] && game[1][x] == game[2][x] && game[0][x] != ""){ gameOver(game[0][x]); }
	}

	if(game[0][0] == game[1][1] && game[1][1] == game[2][2] && game[0][0] != ""){ gameOver(game[0][0]); }
	if(game[0][2] == game[1][1] && game[1][1] == game[2][0] && game[0][2] != ""){ gameOver(game[0][2]); }

	if(notWinner()){
		clearGame();
		alert("Ничья!");
	}
}



for(let player_name of ["cross", "zero"]){
	let element = document.getElementById(player_name);

	element.onmousedown = function(event) {
		let shiftX = event.clientX - element.getBoundingClientRect().left;
		let shiftY = event.clientY - element.getBoundingClientRect().top;

		element.style.position = 'absolute';
		element.style.zIndex = 1000;

		moveAt(event.pageX, event.pageY);
		
		function moveAt(pageX, pageY) {
			let left = pageX - shiftX;
			let top = pageY - shiftY;

			if(left < 0){ left = 0; }
			if(top < 0){ top = 0; }
			if(left > window.innerWidth - 110){ left = window.innerWidth - 110; }
			if(top > window.innerHeight - 110){ top = window.innerHeight - 110; }

			element.style.left = left + 'px';
			element.style.top = top + 'px';
			element.style.background = "#295fdd";
			element.style.color = "#ffffff";

			element.hidden = true;
			elementDrop = document.elementFromPoint(left, top);
			element.hidden = false;
	  	}

		function onMouseMove(event) {
			moveAt(event.pageX, event.pageY);
		}


		document.addEventListener('mousemove', onMouseMove);
		element.onmouseup = function() {
			if(elementDrop.className == "rect" && active_player != player_name){
				alert("Сейчас не ваш ход!")
			}
			else{
				if(elementDrop.className == "rect" && elementDrop.innerHTML == ""){
					elementDrop.innerHTML = element.innerHTML;
					let x = parseInt(elementDrop.attributes.x.value);
					let y = parseInt(elementDrop.attributes.y.value);
					game[y][x] = player_name;
					changePlayer();
				}
			}


			gameOverIF();
			
			
			document.removeEventListener('mousemove', onMouseMove);
			element.onmouseup = null;
			element.style = null;
			add_coins = false;
		};
	};

	element.ondragstart = function() {
		return false;
	};
}