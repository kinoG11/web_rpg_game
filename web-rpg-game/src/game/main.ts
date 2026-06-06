import Phaser from "phaser";

class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  create() {
    this.add.text(240, 180, "Hello Phaser", {
      fontSize: "32px",
      color: "#ffffff",
    });
  }
}

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  backgroundColor: "#1d1d1d",
  parent: "game-container",
  scene: MainScene,
};