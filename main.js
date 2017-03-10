var lose_state = {
	preload: function() { // load what you need to load here

	},

	begin: function() {
		alert("you lose");
		game.state.start('main');
	}
}

function sway(sprite) {
	time = 750;
	reps = 1;
	deg = "45";
	timing = time/(Math.pow(reps, 1.1)*4)
	var t = game.add.tween(sprite).to({ angle: "+" + deg }, timing).to({ angle: "-" + deg }, timing).to({ angle: "-" + deg }, timing).to({ angle: "+" + deg }, timing);
	if (reps > 1) {
		t.repeatAll(reps);
	}
	t.onComplete.add(function(){game.add.tween(sprite).to({ angle: 0 }, timing, Phaser.Easing.Elastic.In, true)}, sprite);
	t.delay(0);
	t.start();
	snd = game.add.audio('nope_s');
	snd.play()
}

function spin(sprite) {
	snd = game.add.audio('win_s');
	snd.play();
	alert("you win!!!!")
	game.add.tween(sprite).to({ angle: 360 }, 2000, null, true);
	game.global.won = true;
}

var main_state = {
	preload: function() {
		game.load.image('male', "assets/male.png");
		game.load.image('female', "assets/female.png");
		game.load.image('soldier', "assets/soldier.png");
		game.load.image('zombie', "assets/zombie.png");
		game.load.image('hally', "assets/hally.png");
		game.load.image('sam', "assets/sam.png");
		game.load.image('willie', "assets/willie.png");

		game.load.audio('win_s', "assets/win.wav");
		game.load.audio('lose_s', "assets/lose.wav");
		game.load.audio('clear_s', "assets/clear.wav");
		game.load.audio('nope_s', "assets/nope.wav");

		game.state.add('lose_state', lose_state)
	},

	create: function() {
		game.stage.backgroundColor = '#ffffff';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		// Add the physics engine to all game objects
		game.stage.enableBody = true;

		game.tweens.frameBased = true;

		game.input.mouse.capture = true;
		
		anims = game.add.group();
		anims.inputEnableChildren = true;
		anims.scale.setTo(game.global.scale_ratio);
		anim = ['male', 'female', 'soldier', 'zombie'];
		mhatbs = game.add.group();
		mhatbs.inputEnableChildren = true;
		mhatbs.scale.setTo(game.global.scale_ratio / 7);
		mhatb = ['hally', 'sam', 'willie'];
		whites = [];
		blacks = [];
		males = [];
		females = [];
		zombies = [];

		bounds = [];

		for (var i = 0; i < 10; i++) {
			rnd = Math.round((Math.random() * 100) % (mhatb.length - 1));
			var spr = mhatbs.create(Math.round(Math.random() * 8000) + 2000, Math.round(Math.random() * 4000) + 2000, mhatb[rnd]);
			spr.events.onInputDown.add(sway, this);
			spr.anchor.setTo(0.5, 0.5);
			for (let b of bounds) {
				if (Phaser.Rectangle.intersects(b, spr.getBounds())) {
					spr.x = Math.round(Math.random() * 8000) + 2000;
					spr.y = Math.round(Math.random() * 4000) + 2000;
				}
			}
			bounds.push(spr.getBounds());
			switch(spr.key) {
				case "hally":
					whites.push(spr);
					males.push(spr);
				break;
				case "sam":
					blacks.push(spr);
					males.push(spr);
				break;
				case "willie":
					blacks.push(spr);
					males.push(spr);
				break;
			}
		}
		for (var i = 0; i < 10; i++) {
			rnd = Math.round((Math.random() * 100) % (anim.length - 1));
			var spr = anims.create(Math.round(Math.random() * 800 / (game.global.scale_ratio * 1.5)), Math.round(Math.random() * 400 / (game.global.scale_ratio * 1.5)) + 400, anim[rnd]);
			spr.events.onInputDown.add(sway, this);
			spr.anchor.setTo(0.5, 0.5);
			for (let b of bounds) {
				if (Phaser.Rectangle.intersects(b, spr.getBounds())) {
					spr.x = Math.round(Math.random() * 800 / (game.global.scale_ratio * 1.5)) + 100;
					spr.y = Math.round(Math.random() * 400 / (game.global.scale_ratio * 1.5)) + 400;
				}
			}
			bounds.push(spr.getBounds());
			switch(spr.key) {
				case "male":
					whites.push(spr);
					males.push(spr);
				break;
				case "female":
					whites.push(spr);
					females.push(spr);
				break;
				case "soldier":
					blacks.push(spr);
					males.push(spr);
				break;
				case "zombie":
					zombies.push(spr);
					males.push(spr);
				break;
			}
		}

		target = Math.random() > 0.5 ? 
			anims.create(Math.round(Math.random() * 800 / (game.global.scale_ratio * 1.5)) + 100, Math.round(Math.random() * 400 / (game.global.scale_ratio * 1.5)) + 400, anim[Math.round((Math.random() * 100) % (anim.length - 1))])
			: mhatbs.create(Math.round(Math.random() * 8000) + 2000, Math.round(Math.random() * 4000) + 2000, mhatb[Math.round((Math.random() * 100) % (mhatb.length - 1))]);
		target.events.onInputDown.add(spin, this);
		target.anchor.setTo(0.5, 0.5);
		for (let b of bounds) {
			if (Phaser.Rectangle.intersects(b, target.getBounds())) {
				if (anims.children.indexOf(target) > -1) {
					target.x = Math.round(Math.random() * 800 / (game.global.scale_ratio * 1.5)) + 100;
					target.y = Math.round(Math.random() * 400 / (game.global.scale_ratio * 1.5)) + 400;
				} else {
					target.x = Math.round(Math.random() * 8000) + 2000;
					target.y = Math.round(Math.random() * 4000) + 2000;
				}
			}
		}
		switch(target.key) {
				case "hally":
					whites.push(target);
					males.push(target);
				break;
				case "sam":
					blacks.push(target);
					males.push(target);
				break;
				case "willie":
					blacks.push(target);
					males.push(target);
				break;
				case "male":
					whites.push(target);
					males.push(target);
				break;
				case "female":
					whites.push(target);
					females.push(target);
				break;
				case "soldier":
					blacks.push(target);
					males.push(target);
				break;
				case "zombie":
					zombies.push(target);
					males.push(target);
				break;
			}

		clue = "Beats me";
		switch(target.key) {
			case "male":
				clue = Math.random() > 0.5 ? "The target is white." : "The target is a drawn character.";
			break;
			case "female":
				clue = Math.random() > 0.5 ? (Math.random() > 0.5 ? "The target is white." : "The target is female.") : "The target is a drawn character.";
			break;
			case "soldier":
				clue = Math.random() > 0.5 ? "The target is black." : "The target is a drawn character.";
			break;
			case "zombie":
				clue = Math.random() > 0.5 ? "The target is a zombie." : "The target is a drawn character.";
			break;
			case "hally":
				clue = Math.random() > 0.5 ? "The target is white." : "The target is a \"Master Harold\" ...and the Boys character.";
			break;
			case "sam":
				clue = Math.random() > 0.5 ? "The target is black." : "The target is a \"Master Harold\" ...and the Boys character.";
			break;
			case "willie":
				clue = Math.random() > 0.5 ? "The target is black." : "The target is a \"Master Harold\" ...and the Boys character.";
			break;
		}

		t_clue = game.add.text(20, 20, "Clue: " + clue, {
			font: "18px Verdana",
			fill: "#000000"
		});
		t_cw = game.add.text(20, game.height - 100, "Q: Clear whites", {
			font: "14px Verdana",
			fill: "#ff0000"
		});
		t_cb = game.add.text(170, game.height - 100, "W: Clear blacks", {
			font: "14px Verdana",
			fill: "#ff0000"
		});
		t_cz = game.add.text(320, game.height - 100, "E: Clear zombies", {
			font: "14px Verdana",
			fill: "#ff0000"
		});
		t_cm = game.add.text(470, game.height - 100, "R: Clear males", {
			font: "14px Verdana",
			fill: "#ff0000"
		});
		t_cf = game.add.text(620, game.height - 100, "T: Clear females", {
			font: "14px Verdana",
			fill: "#ff0000"
		});
		t_dc = game.add.text(20, game.height - 50, "A: Clear drawn characters", {
			font: "14px Verdana",
			fill: "#ff0000"
		});
		t_mh = game.add.text(320, game.height - 50, "S: Clear MHatB characters", {
			font: "14px Verdana",
			fill: "#ff0000"
		});

		t_timer = game.add.text(20, 50, "Time: " + this.game.time.totalElapsedSeconds() + " seconds", {
			font: "14px Verdana",
			fill: "#000000"
		});

		game.global.won = false;
		game.global.restarting = false;
		game.time.reset()
	}, 

	update: function() {
		if (game.input.keyboard.isDown(Phaser.KeyCode.Q)) {
			snd = game.add.audio('clear_s');
			snd.play();
			for (let c of whites) {
				c.kill();
			}
		} else if (game.input.keyboard.isDown(Phaser.KeyCode.W)) {
			snd = game.add.audio('clear_s');
			snd.play();
			for (let c of blacks) {
				c.kill();
			}
		} else if (game.input.keyboard.isDown(Phaser.KeyCode.E)) {
			snd = game.add.audio('clear_s');
			snd.play();
			for (let c of zombies) {
				c.kill();
			}
		} else if (game.input.keyboard.isDown(Phaser.KeyCode.R)) {
			snd = game.add.audio('clear_s');
			snd.play();
			for (let c of males) {
				c.kill();
			}
		} else if (game.input.keyboard.isDown(Phaser.KeyCode.T)) {
			snd = game.add.audio('clear_s');
			snd.play();
			for (let c of females) {
				c.kill();
			}
		} else if (game.input.keyboard.isDown(Phaser.KeyCode.A)) {
			snd = game.add.audio('clear_s');
			snd.play();
			anims.callAll('kill');
		} else if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
			snd = game.add.audio('clear_s');
			snd.play();
			mhatbs.callAll('kill');
		} else if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
			game.global.restarting = true;
			game.state.restart();
		} else if (game.input.keyboard.isDown(Phaser.KeyCode.B)) {
			game.input.mouse.capture = false;
		}
		if (!target.alive && !game.global.restarting) {
			snd = game.add.audio('lose_s');
			snd.play();
			alert("you lose")
			game.state.restart();
		}
		if (!game.global.won) {
			t_timer.text = "Time: " + Math.round(this.game.time.totalElapsedSeconds()) + " seconds";
		} else {
			t_clue.text = "You win! Hit the space bar to restart."
		}
	},

	restartGame: function() {
		// Start the 'main' state, which restarts the game
		game.state.start('main');
	}
};

var game = new Phaser.Game(800, 600, Phaser.CANVAS);
game.global = {
	scale_ratio: (1 / 2.4),
	score: 0,
	won: false,
	restarting: false
};


// Initialize the game and start our state
game.state.add('main', main_state);
game.state.start('main');
