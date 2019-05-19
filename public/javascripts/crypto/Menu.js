export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: "Menu" });
  }

  preload() {
    // this.load.setBaseURL("http://labs.phaser.io");
    // this.load.image("sky", "assets/skies/space3.png");
  }

  create() {
    // let background = this.add.sprite(0, 0, "sky");

    var title = this.make.text({
      x: this.game.renderer.width / 2,
      y: this.game.renderer.height / 3,
      text: "CRYPTO",
      origin: { x: 0.5, y: 0.5 },
      style: {
        font: "bold 34px Arial",
        fill: "white",
        wordWrap: { width: 300 }
      }
    });

    var createRoom = this.make.text({
      x: this.game.renderer.width / 2,
      y: this.game.renderer.height / 2,
      text: "create room",
      origin: { x: 0.5, y: 0.5 },
      style: {
        font: "bold 20px Arial",
        fill: "white",
        wordWrap: { width: 300 }
      }
    });

    var joinRoom = this.make.text({
      x: this.game.renderer.width / 2,
      y: this.game.renderer.height / 2 + 30,
      text: "join room",
      origin: { x: 0.5, y: 0.5 },
      style: {
        font: "bold 20px Arial",
        fill: "white",
        wordWrap: { width: 300 }
      }
    });
  }
}
