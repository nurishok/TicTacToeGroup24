var gamedesk = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0],
];

var ME = -1;
var MinimaxAlgorithm = +1;


function assess(position) {
	var result = 0;

	if (gOver(position, MinimaxAlgorithm)) {
		result = +1;
	}
	else if (gOver(position, ME)) {
		result = -1;
	} else {
		result = 0;
	}

	return result;
}

function loseAll(position) {
	return gOver(position, ME) || gOver(position, MinimaxAlgorithm);
}

function blankCells(position) {
	var cells = [];
	for (var x = 0; x < 3; x++) {
		for (var y = 0; y < 3; y++) {
			if (position[x][y] == 0)
				cells.push([x, y]);
		}
	}

	return cells;
}

function justifiedMove(x, y) {
	var nulls = blankCells(gamedesk);
	try {
		if (gamedesk[x][y] == 0) {
			return true;
		}
		else {
			return false;
		}
	} catch (e) {
		return false;
	}
}


function establishMove(x, y, gamer) {
	if (justifiedMove(x, y)) {
		gamedesk[x][y] = gamer;
		return true;
	}
	else {
		return false;
	}
}


function minimax(position, depth, gamer) {
	var best;

	if (gamer == MinimaxAlgorithm) {
		best = [-1, -1, -1000];
	}
	else {
		best = [-1, -1, +1000];
	}

	if (depth == 0 || loseAll(position)) {
		var result = assess(position);
		return [-1, -1, result];
	}

	blankCells(position).forEach(function (cell) {
		var x = cell[0];
		var y = cell[1];
		position[x][y] = gamer;
		var result = minimax(position, depth - 1, -gamer);
		position[x][y] = 0;
		result[0] = x;
		result[1] = y;

		if (gamer == MinimaxAlgorithm) {
			if (result[2] > best[2])
				best = result;
		}
		else {
			if (result[2] < best[2])
				best = result;
		}
	});

	return best;
}

function gOver(position, gamer) {
	var winning_position = [
		[position[0][0], position[0][1], position[0][2]],
		[position[1][0], position[1][1], position[1][2]],
		[position[2][0], position[2][1], position[2][2]],
		[position[0][0], position[1][0], position[2][0]],
		[position[0][1], position[1][1], position[2][1]],
		[position[0][2], position[1][2], position[2][2]],
		[position[0][0], position[1][1], position[2][2]],
		[position[2][0], position[1][1], position[0][2]],
	];

	for (var i = 0; i < 8; i++) {
		var dash = winning_position[i];
		var full = 0;
		for (var j = 0; j < 3; j++) {
			if (dash[j] == gamer)
				full++;
		}
		if (full == 3)
			return true;
	}
	return false;
}


function minamaxTurn() {
	var x, y;
	var move;
	var cell;

	if (blankCells(gamedesk).length == 9) {
		x = parseInt(Math.random() * 3);
		y = parseInt(Math.random() * 3);
	}
	else {
		move = minimax(gamedesk, blankCells(gamedesk).length, MinimaxAlgorithm);
		x = move[0];
		y = move[1];
	}

	if (establishMove(x, y, MinimaxAlgorithm)) {
		cell = document.getElementById(String(x) + String(y));
		cell.innerHTML = "o";
	}
}

function clickedCell(cell) {
	var button = document.getElementById("bnt-restart");
	button.disabled = true;
	var conditionToContinue = loseAll(gamedesk) == false && blankCells(gamedesk).length > 0;

	if (conditionToContinue == true) {
		var x = cell.id.split("")[0];
		var y = cell.id.split("")[1];
		var move = establishMove(x, y, ME);
		if (move == true) {
			cell.innerHTML = "x";
			if (conditionToContinue)
				minamaxTurn();
		}
	}
	if (gOver(gamedesk, MinimaxAlgorithm)) {
		var dashes;
		var cell;
		var msg;

		if (gamedesk[0][0] == 1 && gamedesk[0][1] == 1 && gamedesk[0][2] == 1)
			dashes = [[0, 0], [0, 1], [0, 2]];
		else if (gamedesk[1][0] == 1 && gamedesk[1][1] == 1 && gamedesk[1][2] == 1)
			dashes = [[1, 0], [1, 1], [1, 2]];
		else if (gamedesk[2][0] == 1 && gamedesk[2][1] == 1 && gamedesk[2][2] == 1)
			dashes = [[2, 0], [2, 1], [2, 2]];
		else if (gamedesk[0][0] == 1 && gamedesk[1][0] == 1 && gamedesk[2][0] == 1)
			dashes = [[0, 0], [1, 0], [2, 0]];
		else if (gamedesk[0][1] == 1 && gamedesk[1][1] == 1 && gamedesk[2][1] == 1)
			dashes = [[0, 1], [1, 1], [2, 1]];
		else if (gamedesk[0][2] == 1 && gamedesk[1][2] == 1 && gamedesk[2][2] == 1)
			dashes = [[0, 2], [1, 2], [2, 2]];
		else if (gamedesk[0][0] == 1 && gamedesk[1][1] == 1 && gamedesk[2][2] == 1)
			dashes = [[0, 0], [1, 1], [2, 2]];
		else if (gamedesk[2][0] == 1 && gamedesk[1][1] == 1 && gamedesk[0][2] == 1)
			dashes = [[2, 0], [1, 1], [0, 2]];

		for (var i = 0; i < dashes.length; i++) {
			cell = document.getElementById(String(dashes[i][0]) + String(dashes[i][1]));
			cell.style.color = "red";
		}

		msg = document.getElementById("message");
		msg.innerHTML = "Ups, you lose!";
	}
	if (blankCells(gamedesk).length == 0 && !loseAll(gamedesk)) {
		var msg = document.getElementById("message");
		msg.innerHTML = "STANDOFF!";
	}
	if (loseAll(gamedesk) == true || blankCells(gamedesk).length == 0) {
		button.value = "RESTART";
		button.disabled = false;
	}
}


function restartBnt(button) {
	if (button.value == "MINIMAX FIRST") {
		minamaxTurn();
		button.disabled = true;
	}
	else if (button.value == "RESTART") {
		var htmlBoard;
		var msg;

		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				gamedesk[x][y] = 0;
				htmlBoard = document.getElementById(String(x) + String(y));
				htmlBoard.style.color = "#444";
				htmlBoard.innerHTML = "";
			}
		}
		button.value = "MINIMAX FIRST";
		msg = document.getElementById("message");
		msg.innerHTML = "";
	}
}