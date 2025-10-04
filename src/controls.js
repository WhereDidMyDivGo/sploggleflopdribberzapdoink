import * as Tone from "https://cdn.skypack.dev/tone@15.1.22";

export class Controls {
  constructor() {
    // i=2 4 2 2 p=1 1 m=
    this.sectionLengths = [2, 4, 2, 2, 1, 1, 11, 11, 11];
    this.SKIP_TO_SECTION = null;
    // this.SKIP_TO_SECTION = 6;

    this.currentSection = 0;
    this.initializeControls();
  }

  initializeControls() {
    const startBtn = document.getElementById("start");
    if (startBtn) {
      startBtn.addEventListener("click", async () => {
        await Tone.start();
        startBtn.disabled = true;
        this.onStartCallback?.();
      });
    }
  }

  onStart(callback) {
    this.onStartCallback = callback;
  }

  initializeSection() {
    if (this.SKIP_TO_SECTION !== null && this.SKIP_TO_SECTION >= 0 && this.SKIP_TO_SECTION < this.sectionLengths.length) {
      this.currentSection = this.SKIP_TO_SECTION;
      console.log(`SKIPPING TO SECTION ${this.SKIP_TO_SECTION} FOR TESTING`);
    }
  }
}
