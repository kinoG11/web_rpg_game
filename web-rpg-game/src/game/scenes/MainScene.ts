import Phaser from "phaser";
import { DialogueWindow } from "../ui/DialogueWindow";
import type { DialogueLine } from "../ui/DialogueWindow";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 32;
const PLAYER_SPEED = 4;

export class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private npc!: Phaser.GameObjects.Rectangle;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private dialogueWindow!: DialogueWindow;

  private dialogueLines: DialogueLine[] = [
    {
      speaker: "魔法使い",
      text: "ようこそ、小さな旅人よ。",
    },
    {
      speaker: "魔法使い",
      text: "この森の奥には、古い遺跡が眠っている。",
    },
    {
      speaker: "魔法使い",
      text: "進むなら、覚悟を持つことだ。",
    },
  ];

  private dialogueIndex = 0;
  private isTalking = false;

  constructor() {
    super({ key: "MainScene" });
  }

  preload(): void {
    this.load.image("player", "/assets/player.png");
  }

  create(): void {
    this.player = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      PLAYER_SIZE,
      PLAYER_SIZE,
      0x00ff00,
    );

    this.npc = this.add.rectangle(300, 250, 32, 32, 0x8844ff);

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

    this.interactKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.E,
    );

    this.dialogueWindow = new DialogueWindow(this, GAME_WIDTH, GAME_HEIGHT);
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      if (this.isTalking) {
        this.advanceDialogue();
        return;
      }

      if (this.isNearNpc()) {
        this.startDialogue();
        return;
      }
    }

    if (this.isTalking) {
      return;
    }

    this.updatePlayerMovement();
  }

  private updatePlayerMovement(): void {
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.left?.isDown || this.wasdKeys.A.isDown) {
      velocityX -= PLAYER_SPEED;
    }

    if (this.cursors.right?.isDown || this.wasdKeys.D.isDown) {
      velocityX += PLAYER_SPEED;
    }

    if (this.cursors.up?.isDown || this.wasdKeys.W.isDown) {
      velocityY -= PLAYER_SPEED;
    }

    if (this.cursors.down?.isDown || this.wasdKeys.S.isDown) {
      velocityY += PLAYER_SPEED;
    }

    this.player.x += velocityX;
    this.player.y += velocityY;

    this.clampPlayerPosition();
  }

  private showCurrentDialogueLine(): void {
    const currentLine = this.dialogueLines[this.dialogueIndex];

    this.dialogueWindow.setDialogue(currentLine);
  }

  private clampPlayerPosition(): void {
    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      PLAYER_SIZE / 2,
      GAME_WIDTH - PLAYER_SIZE / 2,
    );

    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      PLAYER_SIZE / 2,
      GAME_HEIGHT - PLAYER_SIZE / 2,
    );
  }

  private isNearNpc(): boolean {
    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.npc.x,
      this.npc.y,
    );

    return distance <= 60;
  }

  private startDialogue(): void {
    this.isTalking = true;
    this.dialogueIndex = 0;
    this.dialogueWindow.show();
    this.showCurrentDialogueLine();
  }
  private advanceDialogue(): void {
    this.dialogueIndex++;

    if (this.dialogueIndex >= this.dialogueLines.length) {
      this.endDialogue();
      return;
    }
  }

  private endDialogue(): void {
    this.isTalking = false;
    this.dialogueIndex = 0;
    this.dialogueWindow.hide();
  }
}
