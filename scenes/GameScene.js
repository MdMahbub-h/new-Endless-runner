import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.speed = 1.3;
    this.state = 0;
    this.pressed = false;

    this.stones = [];
    this.coins = [];

    this.gameStart = false;
    this.colidDetect;
    this.bg;

    this.textPoint;
    this.emitter;
    this.cursors;
    this.player;
    this.timeObstacle = 3;
    this.coin;
    this.top = 100;
  }

  create() {
    this.resetGame();
    this.soundOn = true;
    this.onetime = false;
    this.blurbg = this.add
      .image(this.scale.width / 2, this.scale.height / 2, "welcomebg")
      .setDisplaySize(this.scale.width, this.scale.height);
    this.blurbg.alpha = 0.3;
    this.scene.pause("scene-game");
    this.cursors = this.input.keyboard.createCursorKeys();
    this.initializeBackground();
    this.initializeAnimations();

    this.textPoint = this.add
      .text(this.scale.width / 2 + 20, this.top - 20, "0", {
        font: "60px Arial bold",
        fill: "#ffffff",
      })
      .setOrigin(0, 0.5)
      .setDepth(4);
    this.add
      .image(this.scale.width / 2 - 50, this.top - 25, "honeypot")
      .setScale(0.3)
      .setOrigin(0, 0.5);

    this.player = this.physics.add
      .sprite(150, 470 + this.top, "stay")
      .setScale(0.7)
      .setOrigin(0, 1);
    this.player.anims.play("stay");

    this.player.setDepth(5);
    this.player.on("animationcomplete-fall", () => {
      this.gameOver();
    });
    this.colidDetect = this.physics.add
      .image(this.player.x + 80, this.player.y - 80 + this.top, "icon")
      .setScale(0.3, 0.5)
      .setOrigin(0, 0)
      .setDepth(1);

    const updateTimer = () => {
      if (this.gameStart) {
        this.timeObstacle -= 1;
        console.log(this.timeObstacle);
      }
    };

    const onSecondElapsed = () => {
      updateTimer();
    };

    this.initializeTimer(onSecondElapsed);
    this.soundIcon = this.add
      .image(
        this.scale.width * 0.93,
        this.scale.height * 0.1,
        this.soundOn ? "soundOn" : "soundOff"
      )
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(Infinity);
    this.soundIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.soundIcon,
        scale: 0.9,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.soundIcon,
            scale: 1,
            duration: 100,

            onComplete: () => {
              if (this.soundOn) {
                this.sound.stopAll();
                this.soundOn = false;
                this.soundIcon.setTexture("soundOff");
              } else {
                this.soundOn = true;
                this.soundIcon.setTexture("soundOn");
              }
            },
          });
        },
      });
    });
  }

  update(time, delta) {
    this.colidDetect.x = this.player.x + 40;
    this.colidDetect.y = this.player.y - 100;
    this.playerInteraction();

    if (this.state > 0 && this.state !== 4) {
      this.bg.tilePositionX += 12 * this.speed;
      this.front.tilePositionX += 12 * this.speed;
    }

    if (this.timeObstacle == 0 && this.state !== 4) {
      this.addObstackle();
    }
    if (this.state == 4) {
      for (let i; i < this.stones.length; i++) {
        this.stones[i].setVelocityX(0);
      }
      for (let i; i < this.coins.length; i++) {
        this.coins[i].setVelocityX(0);
      }
    }
  }

  initializeBackground() {
    this.bg = this.add
      .tileSprite(0, 50 + this.top, 15000 / 1.5, 1599 / 1.5, "bg")
      .setScale(0.313 * 1.5)
      .setOrigin(0, 0)
      .setDepth(2)
      .setAlpha(0.9);
    this.front = this.add
      .tileSprite(
        0,
        -this.scale.height / 5.5 + this.top,
        15000 / 1.5,
        1599,
        "front"
      )
      .setScale(0.313 * 1.5)
      .setOrigin(0, 0)
      .setDepth(6);
  }

  initializeTimer(timerCallback) {
    this.time.addEvent({
      delay: 1000,
      callback: timerCallback,
      args: [1],
      callbackScope: this,
      loop: true,
    });
  }

  initializeAnimations() {
    this.anims.create({
      key: "stay",
      frames: this.anims.generateFrameNumbers("stay", { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("run", { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("jump", { start: 0, end: 8 }),
      frameRate: 8,
    });
    this.anims.create({
      key: "slip",
      frames: this.anims.generateFrameNumbers("slip", { start: 0, end: 8 }),
      frameRate: 8,
    });
    this.anims.create({
      key: "fall",
      frames: this.anims.generateFrameNumbers("fall", { start: 0, end: 4 }),
      frameRate: 6,
    });
    this.anims.create({
      key: "coin",
      frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "bird",
      frames: this.anims.generateFrameNumbers("bird", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  playerInteraction(state) {
    if (this.player.y < 380 + this.top) {
      this.player.setVelocityY(190);
    } else if (this.player.y > 470 + this.top) {
      this.player.setVelocityY(0);
      this.player.y = 470 + this.top;
    }

    if (!this.pressed && this.state !== 4) {
      if (this.cursors.right.isDown && this.state !== 1) {
        this.player.anims.play("run");
        this.gameStart = true;
        this.state = 1;
      }
      if (this.cursors.up.isDown) {
        this.player.anims.play("jump");
        this.player.setVelocityY(-190);
        this.state = 2;
        this.pressed = true;

        this.player.on("animationcomplete-jump", () => {
          this.state = 1;
          this.pressed = false;
          this.player.anims.play("run");
        });
      }
      if (this.cursors.down.isDown) {
        this.player.anims.play("slip");
        this.pressed = true;
        this.state = 3;
        this.player.on("animationcomplete-slip", () => {
          this.state = 1;
          this.pressed = false;
          this.player.anims.play("run");
        });
      }
    }
  }

  addObstackle() {
    this.timeObstacle = 4;
    let selectElement = Phaser.Math.Between(1, 2);
    let honeyPotOn = false;
    if (Phaser.Math.Between(1, 3) > 2) {
      honeyPotOn = true;
    }
    if (honeyPotOn) {
      setTimeout(() => {
        let obstacle = this.physics.add.image(
          this.scale.width + 200,
          440 + this.top,
          "honeypot"
        );
        obstacle
          .setVelocityX(-228 * 1.5 * this.speed)
          .setScale(0.3)
          .setDepth(4);
        this.physics.add.overlap(
          obstacle,
          this.colidDetect,
          () => {
            this.Point += 1;
            obstacle.destroy();
            this.textPoint.setText(this.Point);
          },
          null,
          this
        );
      }, 2000);
    }
    if (selectElement == 1) {
      let obstacle = this.physics.add.sprite(
        this.scale.width + 200,
        340 + this.top,
        "bird"
      );
      obstacle.anims.play("bird");
      if (this.state == 4) {
        this.obstacle.setVelocityX(0);
      } else {
        obstacle.setVelocityX(-300 * 1.5 * this.speed);
      }
      obstacle.setScale(0.4).setDepth(4);
      this.physics.add.collider(
        obstacle,
        this.colidDetect,
        () => {
          obstacle.setVelocityX(-250 * 1.5 * this.speed);
          obstacle.setVelocityY(-20);
          if (this.state !== 3 && this.state !== 4) {
            if (!this.onetime && this.Point !== 0) {
              this.Point -= 1;
              this.textPoint.setText(this.Point);
              this.onetime = true;
              setTimeout(() => {
                this.onetime = false;
              }, 1000);
            }
          }
        },
        null,
        this
      );
    } else if (selectElement == 2) {
      let obstacle = this.physics.add.image(
        this.scale.width + 200,
        450 + this.top,
        "rock"
      );
      obstacle
        .setVelocityX(-228 * 1.5 * this.speed)
        .setScale(0.5)
        .setDepth(4);
      this.physics.add.overlap(
        obstacle,
        this.colidDetect,
        () => {
          if (this.state !== 4) {
            this.state = 4;
            obstacle.setVelocityX(0);
            this.player.anims.play("fall");
            this.bg.tilePositionX += 0;
            this.front.tilePositionX += 0;
            this.player.on("animationcomplete-fall", () => {
              this.gameOver();
            });
          }
        },
        null,
        this
      );
      this.stones.push(obstacle);
    }
  }

  resetGame() {
    this.speed = 1;
    this.state = 0;
    this.pressed = false;

    this.gameStart = false;
    this.colidDetect;
    this.bg;
    this.Point = 0;
    this.textPoint;
    this.emitter;
    this.cursors;
    this.player;
    this.timeObstacle = 3;
  }

  gameOver() {
    if (this.point >= 20) {
      this.scene.start("WinScene", { score: this.Point });
    } else {
      this.scene.start("LoseScene", { score: this.Point });
    }
  }
}

export default GameScene;
