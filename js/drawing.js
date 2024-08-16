// Functions responsible for drawing on canvas

game.drawTile = function (tileColumn, tileRow, x, y) {
	game.context.drawImage(
		game.textures,
		tileColumn * game.options.tileWidth,
		tileRow * game.options.tileHeight,
		game.options.tileWidth,
		game.options.tileHeight,
		x * game.options.tileWidth - Math.round(game.player.x) + Math.round(game.options.canvasWidth / 2 + game.options.tileWidth / 2),
		y * game.options.tileHeight - Math.round(game.player.y) + Math.round(game.options.canvasHeight / 2 + game.options.tileHeight / 2),
		game.options.tileWidth,
		game.options.tileHeight
	)
}

game.drawStructure = function (name, x, y) {
	var structure = game.structures[name]
	for (var i = 0; i < structure.length; i++) {
		game.drawTile(structure[i].tileColumn, structure[i].tileRow, structure[i].x + x, structure[i].y + y)
	}
}

game.drawPlayer = function () {
	actualPlayerTile = game.player.animations[game.player.direction][game.player.animationFrameNumber % 4]
	game.context.drawImage(
		game.textures,
		actualPlayerTile.tileColumn * game.options.tileWidth,
		actualPlayerTile.tileRow * game.options.tileHeight,
		game.options.tileWidth,
		game.options.tileHeight,
		Math.round(game.options.canvasWidth / 2 - game.options.tileWidth / 2),
		Math.round(game.options.canvasHeight / 2 - game.options.tileHeight / 2),
		game.options.tileWidth,
		game.options.tileHeight
	)
}

game.redraw = function () {

	// Draw the background
	if (game.backgrounds['sky'].loaded) {
		var pattern = game.context.createPattern(game.backgrounds['sky'].image, 'repeat') // Create a pattern with this image, and set it to "repeat".
		game.context.fillStyle = pattern
	} else {
		game.context.fillStyle = "#78c5ff"
	}

	game.context.fillRect(0, 0, game.canvas.width, game.canvas.height)

	if (game.backgrounds['trees'].loaded) {
		game.context.drawImage(game.backgrounds['trees'].image, 0, game.canvas.height / 2 - game.player.y / 10, 332, 180)
		game.context.drawImage(game.backgrounds['trees'].image, 332, game.canvas.height / 2 - game.player.y / 10, 332, 180)
	}

	// List nearest structures
	if (!game.timer.isRunning && game.timer.timer === 0) {
		game.drawTitle();
	}
	var structuresToDraw = []
	var drawing_distance = 15
	for (var i = 0; i < game.map.structures.length; i++) {
		if (
			game.map.structures[i].x > (game.player.x / game.options.tileWidth) - drawing_distance
			&& game.map.structures[i].x < (game.player.x / game.options.tileWidth) + drawing_distance
			&& game.map.structures[i].y > (game.player.y / game.options.tileHeight) - drawing_distance
			&& game.map.structures[i].y < (game.player.y / game.options.tileHeight) + drawing_distance
		) {
			structuresToDraw.push(game.map.structures[i])
		}
	}

	// Draw them
	for (var i = 0; i < structuresToDraw.length; i++) {
		game.drawStructure(structuresToDraw[i].name, structuresToDraw[i].x, structuresToDraw[i].y)
	}

	// Draw the player
	game.drawPlayer()

	game.points = Math.round(-game.player.highestY / (3 * game.options.tileHeight)), game.canvas.width - 50, game.canvas.height - 12;
	game.counter.innerHTML = "A game by Karol Swierczek modify by Koda14 | Controls: A, D / arrows and SPACE | Points: " + game.points;
}

game.timer = {
	timer: 0,
	isRunning: false,
	timerElement: document.getElementById('timer'),
	startTime: 0,

	start: function () {
		if (!this.isRunning) {
			this.timer = Date.now() - this.elapsedTime;
			this.startTime = Date.now();
			this.isRunning = true;
			this.update();
		}
	},

	stop: function () {
		if (this.isRunning) {
			this.isRunning = false;
			this.timer = Date.now() - this.startTime;
		}
	},

	update: function () {
		if (this.isRunning) {
			this.timer = Date.now() - this.startTime;
			this.updateDisplay();
			requestAnimationFrame(this.update.bind(this));
		}
	},

	updateDisplay: function () {
		const seconds = Math.floor(this.timer / 1000);
		this.timerElement.innerHTML = `Time: ${seconds}s`;
	}



}

game.drawTitle = function () {
	game.context.font = "20px superscript"
	game.context.textAlign = "center"
	game.context.fillStyle = "black"
	game.context.fillText("THE ORANGE MAN, CAN U REACH THE MOON ?", game.canvas.width / 2, game.canvas.height / 2)
	game.context.font = "15px Georgia"
	game.context.fillText("Press A, D to move and SPACE to jump, START?", game.canvas.width / 2, game.canvas.height / 2 + 50)
}

game.requestRedraw = function () {
	if (!game.isOver) {
		game.redraw();
	}

	if (game.isOver) {
		clearInterval(this.player.fallInterval)
		game.timer.stop()

		game.context.font = "30px superscript"
		game.context.textAlign = "center"
		game.context.fillStyle = "black"
		game.context.fillText("Game over!", game.canvas.width / 2, game.canvas.height / 2)
		game.context.fillText(`${game.points} points in ${Math.floor(game.timer.timer / 1000)} s`, game.canvas.width / 2, game.canvas.height / 2 + 25)
		game.context.font = "15px Georgia"
		game.context.fillText("Press SPACE to restart", game.canvas.width / 2, game.canvas.height / 2 + 50)
	}
}
game.restart = function () {
	game.isOver = false
	game.player.x = 54
	game.player.y = 0
	game.player.highestY = 0
	game.player.direction = "right"
	game.player.isInAir = false
	game.player.animationFrameNumber = 0
	game.player.collidesWithGround = true

	// Reset timer
	game.timer.timer = 0
	game.timer.startTime = 0
	game.timer.updateDisplay()

	game.generateMap()
}
game.loop = function () {
	game.requestRedraw()
	requestAnimationFrame(game.loop)
}