game.player = {
		x: 54,
		y: 0,
		height: 24,
		highestY: 0,
		direction: "left",
		isInAir: false,
		startedJump: false,
		numberOfAllowedJump: 2,
	    fallTimeoutId: null,
		moveInterval: null,
		fallTimeout: function(startingY, time, maxHeight) {
			console.log("IsInAir:", this.isInAir, "AllowedJumps:", this.numberOfAllowedJump);
		console.log("StartingY:", startingY, "Time:", time, "MaxHeight:", maxHeight);
		if (this.fallTimeoutId) clearTimeout(this.fallTimeoutId)
		this.fallTimeoutId = setTimeout(function () {
			if (this.isInAir) {
				this.y = startingY - maxHeight + Math.pow((-time / 3 + 11), 2)
				if (this.y < this.highestY) {
					this.highestY = this.y
				}
				if (time > 37) {
					this.startedJump = false
					game.checkCollisions()
				}
				if (time < 150) {
					time++
					this.fallTimeout(startingY, time, maxHeight)
				} else {
					game.isOver = true
				}
				if (this.y > 40) {
					game.isOver = true
				}
			} else {
				this.numberOfAllowedJump = 2
			}
		}.bind(this, startingY, time, maxHeight), 12)
		},
		animationFrameNumber: 0,
		collidesWithGround: true,
		animations: {
			// Describe coordinates of consecutive animation frames of objects in textures
			left: [{tileColumn: 4, tileRow: 0}, {tileColumn: 5, tileRow: 0}, {tileColumn: 4, tileRow: 0}, {tileColumn: 6, tileRow: 0}],
			right: [{tileColumn: 9, tileRow: 0}, {tileColumn: 8, tileRow: 0}, {tileColumn: 9, tileRow: 0}, {tileColumn: 7, tileRow: 0}]
		},
		jump: function (type) {
			if (!game.timer.isRunning && game.timer.timer === 0) game.timer.start();
			var startingY = this.y;
			var time = 1;
			var maxHeight = 121;
			if (type == "fall") {
				if (!this.isInAir) {
					time = 30;
					maxHeight = 0;
					this.isInAir = true;
					this.fallTimeout(startingY, time, maxHeight);
				}
				return;
			}
			if (!this.isInAir) {
				this.initiateJump(startingY, time, maxHeight)
			} else {
				if (this.numberOfAllowedJump > 0) {
					this.initiateJump(startingY, time, Math.round(maxHeight))
				}
			}
			
		},
		initiateJump: function (startingY, time, maxHeight) {
			clearInterval(this.fallTimeoutId);
			game.sounds.jump.play();
			this.startedJump = true;
			this.isInAir = true;
			this.numberOfAllowedJump -= 1;
			this.fallTimeout(startingY, time, maxHeight);
		}
	}
