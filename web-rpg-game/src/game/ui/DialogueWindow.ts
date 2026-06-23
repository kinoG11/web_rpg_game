import Phaser from "phaser";

export type DialogueLine = {
  speaker: string;
  text: string;
};

export class DialogueWindow {
  private scene: Phaser.Scene;

  private box: Phaser.GameObjects.Rectangle;
  private speakerText: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;
  private nextText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, width: number, height: number) {
    this.scene = scene;

    const boxWidth = width - 80;
    const boxHeight = 150;
    const boxX = width / 2;
    const boxY = height - 100;

    const leftX = 70;
    const speakerY = height - 155;
    const bodyY = height - 120;
    const nextX = width - 140;
    const nextY = height - 55;

    this.box = this.scene.add.rectangle(
      boxX,
      boxY,
      boxWidth,
      boxHeight,
      0x000000,
      0.8,
    );

    this.speakerText = this.scene.add.text(leftX, speakerY, "", {
      fontSize: "18px",
      color: "#ffffff",
    });

    this.bodyText = this.scene.add.text(leftX, bodyY, "", {
      fontSize: "16px",
      color: "#ffffff",
      wordWrap: { width: width - 140 },
      lineSpacing: 6,
    });

    this.nextText = this.scene.add.text(nextX, nextY, "[E] 次へ", {
      fontSize: "14px",
      color: "#ffffff",
    });

    this.hide();
  }

  show(): void {
    this.box.setVisible(true);
    this.speakerText.setVisible(true);
    this.bodyText.setVisible(true);
    this.nextText.setVisible(true);
  }

  hide(): void {
    this.box.setVisible(false);
    this.speakerText.setVisible(false);
    this.bodyText.setVisible(false);
    this.nextText.setVisible(false);
  }

  setDialogue(line: DialogueLine): void {
    this.speakerText.setText(line.speaker);
    this.bodyText.setText(line.text);
  }
}
