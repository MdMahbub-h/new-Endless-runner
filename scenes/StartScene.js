import Phaser from "phaser";

class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
    this.soundOn = true;
  }

  create() {
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "welcomebg")
      .setDisplaySize(this.scale.width, this.scale.height);
    this.playBtn = this.add
      .image(this.scale.width / 2, this.scale.height * 0.85, "playbtn")
      .setInteractive({ cursor: "pointer" });
    this.playBtnText = this.add
      .text(this.scale.width / 2, this.scale.height * 0.85, "Play", {
        fontSize: "32px",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5);
    let scoreBoxOn = false;
    this.playBtn.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.playBtn, this.playBtnText],
        scale: 0.85,
        duration: 100,
        onComplete: () => {
          this.tweens.add({
            targets: [this.playBtn, this.playBtnText],
            scale: 1,
            duration: 100,
            onComplete: () => {
              if (!scoreBoxOn) {
                let detailsBox = this.add
                  .image(
                    this.scale.width / 2,
                    this.scale.height / 2,
                    "detailsBox"
                  )
                  .setScale(2);
                this.playBtnText.setText("Start");
                this.add
                  .text(
                    this.scale.width / 2,
                    this.scale.height / 2.8,
                    "You have to collect\n\nHoney Pots.Be aware\n\nof birds. Bird can\n\nstole your honey",
                    {
                      fontSize: "30px",
                      fontStyle: "bold",
                    }
                  )
                  .setOrigin(0.5, 0);
                scoreBoxOn = true;
              } else {
                this.scene.start("GameScene");
              }
            },
          });
        },
      });
    });

    this.startSound = this.sound.add("startSound", { loop: true, volume: 0.7 });
    if (this.soundOn) {
      this.startSound.play();
    }

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
  }
}

export default StartScene;
