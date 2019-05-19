import Menu from "./Menu.js";

var game;

let menu = new Menu();

const config = {
  title: "App",
  width: 800,
  height: 550,
  scene: [menu],
  backgroundColor: "#546de5"
};

game = new Phaser.Game(config);
