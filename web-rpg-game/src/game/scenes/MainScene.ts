import Phaser from "phaser";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 32;
const PLAYER_SPEED = 4;

export class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super({ key: "MainScene" });
  }

  create(): void {
    this.player = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      PLAYER_SIZE,
      PLAYER_SIZE,
      0x00ff00,
    );

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.wasdKeys = this.input.keyboard!.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    }) as {
      W: Phaser.Input.Keyboard.Key;
      A: Phaser.Input.Keyboard.Key;
      S: Phaser.Input.Keyboard.Key;
      D: Phaser.Input.Keyboard.Key;
    };
  }

  update(): void {
    let moveX = 0;
    let moveY = 0;

    if (this.cursors.left?.isDown || this.wasdKeys.A.isDown) {
      moveX = -1;
    } else if (this.cursors.right?.isDown || this.wasdKeys.D.isDown) {
      moveX = 1;
    }

    if (this.cursors.up?.isDown || this.wasdKeys.W.isDown) {
      moveY = -1;
    } else if (this.cursors.down?.isDown || this.wasdKeys.S.isDown) {
      moveY = 1;
    }

    const moveVector = new Phaser.Math.Vector2(moveX, moveY);

    if (moveVector.length() > 0) {
      moveVector.normalize();

      this.player.x += moveVector.x * PLAYER_SPEED;
      this.player.y += moveVector.y * PLAYER_SPEED;
    }

    const halfPlayerSize = PLAYER_SIZE / 2;

    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      halfPlayerSize,
      GAME_WIDTH - halfPlayerSize,
    );

    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      halfPlayerSize,
      GAME_HEIGHT - halfPlayerSize,
    );
  }
}
