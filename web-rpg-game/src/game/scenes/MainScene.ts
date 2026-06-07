import Phaser from "phaser";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 32;
const PLAYER_SPEED = 4;

type DialogueLine = {
  speaker: string;
  text: string;
};

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

  private dialogueBox!: Phaser.GameObjects.Rectangle;
  private speakerText!: Phaser.GameObjects.Text;
  private dialogueText!: Phaser.GameObjects.Text;
  private nextText!: Phaser.GameObjects.Text;

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

    this.createDialogueWindow();
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

  private createDialogueWindow(): void {
    this.dialogueBox = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 100,
      GAME_WIDTH - 80,
      160,
      0x000000,
      0.8,
    );

    this.speakerText = this.add.text(70, GAME_HEIGHT - 155, "", {
      fontSize: "18px",
      color: "#ffffff",
    });

    this.dialogueText = this.add.text(70, GAME_HEIGHT - 120, "", {
      fontSize: "16px",
      color: "#ffffff",
      wordWrap: { width: GAME_WIDTH - 140 },
    });

    this.nextText = this.add.text(
      GAME_WIDTH - 140,
      GAME_HEIGHT - 55,
      "[E] 次へ",
      {
        fontSize: "14px",
        color: "#ffffff",
      },
    );

    this.hideDialogueWindow();
  }

  private showDialogueWindow(): void {
    this.dialogueBox.setVisible(true);
    this.speakerText.setVisible(true);
    this.dialogueText.setVisible(true);
    this.nextText.setVisible(true);
  }

  private hideDialogueWindow(): void {
    this.dialogueBox.setVisible(false);
    this.speakerText.setVisible(false);
    this.dialogueText.setVisible(false);
    this.nextText.setVisible(false);
  }

  private startDialogue(): void {
    this.isTalking = true;
    this.dialogueIndex = 0;
    this.showDialogueWindow();
    this.showCurrentDialogueLine();
  }

  private showCurrentDialogueLine(): void {
    const currentLine = this.dialogueLines[this.dialogueIndex];

    this.speakerText.setText(currentLine.speaker);
    this.dialogueText.setText(currentLine.text);
  }

  private advanceDialogue(): void {
    this.dialogueIndex++;

    if (this.dialogueIndex >= this.dialogueLines.length) {
      this.endDialogue();
      return;
    }

    this.showCurrentDialogueLine();
  }

  private endDialogue(): void {
    this.isTalking = false;
    this.dialogueIndex = 0;
    this.hideDialogueWindow();
  }
}
