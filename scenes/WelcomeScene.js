import Phaser from "phaser";
import OptionsScene from "./OptionsScene";

class WelcomeScene extends Phaser.Scene {
  constructor() {
    super("WelcomeScene");
  }
  preload() {
    this.load.image("welcomebg", "/assets/welcomebg.png");
    this.load.image("progress", "/assets/progress.png");
    this.load.image("progress2", "/assets/progress2.png");
    this.load.image("playbtn", "/assets/wooden/Asset 11button.png");
    this.load.image("soundOn", "/assets/wooden/Asset 7.png");
    this.load.image("soundOff", "/assets/wooden/Asset 6.png");
    this.load.image("detailsBox", "/assets/wooden/Asset 12button.png");
    this.load.audio("startSound", "/assets/startSound.mp3");
    this.load.image("winbg", "/assets/winbg.png");
    this.load.image("homebtn", "/assets/wooden/Asset 8.png");
    this.load.image("replaybtn", "/assets/wooden/Asset 11.png");
    this.load.image("honeypot", "/assets/honeypot.png");

    this.load.image("front", "/assets/depth5.png");
    this.load.image("bg", "/assets/fullbg.png");
    this.load.image("icon", "/assets/icon.png");
    this.load.image("rock", "/assets/rock.png");
    this.load.spritesheet("stay", "/assets/stay.png", {
      frameWidth: 426 / 4,
      frameHeight: 200,
    });
    this.load.spritesheet("run", "/assets/run.png", {
      frameWidth: (563 * 2) / 6,
      frameHeight: 98 * 2,
    });
    this.load.spritesheet("jump", "/assets/jump.png", {
      frameWidth: (686 * 2) / 9,
      frameHeight: 100 * 2,
    });
    this.load.spritesheet("slip", "/assets/slip.png", {
      frameWidth: 1836 / 9,
      frameHeight: 129,
    });
    this.load.spritesheet("fall", "/assets/fall.png", {
      frameWidth: (465 * 2) / 5,
      frameHeight: 90 * 2,
    });
    this.load.spritesheet("coin", "/assets/coin.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet("bird", "/assets/bird.png", {
      frameWidth: 1200 / 6,
      frameHeight: 188,
    });
  }

  create() {
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "welcomebg")
      .setDisplaySize(this.scale.width, this.scale.height);

    let width = this.scale.width;
    let height = this.scale.height * 0.9;

    let pwidth = width * 0.695;
    let pheight = 30;

    let progressBox = this.add.image(
      this.scale.width / 2,
      this.scale.height * 0.9,
      "progress"
    );
    progressBox.setDisplaySize(this.scale.width * 0.7, 40);

    let progressBox2 = this.add
      .image(this.scale.width / 2, this.scale.height * 0.9, "progress2")
      .setDepth(3);
    progressBox2.setDisplaySize(this.scale.width * 0.7, 40);
    let progressBar = this.add.graphics();

    let time = 0;
    let timer = this.time.addEvent({
      delay: 20,
      callback: () => {
        progressBar.clear();
        progressBar.fillStyle(0x80a300, 1);
        progressBar.fillRect(
          width / 2 - pwidth / 2 + 2,
          height - pheight / 2,
          pwidth * time,
          pheight
        );
        // phaser = DOMStringList;
        if (time >= 1) {
          progressBar.destroy();
          progressBox.destroy();
          this.time.removeEvent(timer);
          this.scene.start("StartScene");
          this.game.scene.add("OptionsScene", new OptionsScene(), true);
        } else {
          time += 0.01;
        }
      },
      callbackScope: this,
      loop: true,
    });
  }
}

export default WelcomeScene;
