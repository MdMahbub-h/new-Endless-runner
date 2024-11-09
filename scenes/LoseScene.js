import Phaser from "phaser";

class LoseScene extends Phaser.Scene {
  constructor() {
    super("LoseScene");
  }

  create({ score }) {
    this.soundOn = true;
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "winbg")
      .setDisplaySize(this.scale.width, this.scale.height);
    let detailsBox = this.add
      .image(this.scale.width / 2, this.scale.height / 2.5, "detailsBox")
      .setScale(2.5);

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
                this.startSound.play();
              }
            },
          });
        },
      });
    });

    this.replayBtn = this.add
      .image(this.scale.width / 2 + 80, this.scale.height * 0.83, "replaybtn")
      .setInteractive({ cursor: "pointer" })
      .setScale(1.5);

    this.replayBtn.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.replayBtn],
        scale: 1.3,
        duration: 100,
        onComplete: () => {
          this.tweens.add({
            targets: [this.replayBtn],
            scale: 1.5,
            duration: 100,
            onComplete: () => {
              this.scene.start("GameScene");
            },
          });
        },
      });
    });

    this.homeBtn = this.add
      .image(this.scale.width / 2 - 80, this.scale.height * 0.83, "homebtn")
      .setInteractive({ cursor: "pointer" })
      .setScale(1.5);

    this.homeBtn.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.homeBtn],
        scale: 1.3,
        duration: 100,
        onComplete: () => {
          this.tweens.add({
            targets: [this.homeBtn],
            scale: 1.5,
            duration: 100,
            onComplete: () => {
              this.scene.start("StartScene");
            },
          });
        },
      });
    });
    this.add
      .text(this.scale.width / 2 + 5, this.scale.height / 3.5, score, {
        fontSize: "70px",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);
    this.add
      .image(this.scale.width / 2 - 35, this.scale.height / 3.5, "honeypot")
      .setScale(0.3)
      .setOrigin(0.5, 0.5);
    this.add
      .text(this.scale.width / 2, this.scale.height / 2.5, "You Lose!!!", {
        fontSize: "50px",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5);
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Better Luck Next Time!",
        {
          fontSize: "30px",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5, 0.5);
  }
}

export default LoseScene;
