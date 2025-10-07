// import * as Tone from "https://cdn.skypack.dev/tone@15.1.22";
// import { TESTING } from "./testing.js";

// export class Controls {
//   constructor() {
//     this.currentSection = 0;
//     this.initializeControls();
//   }

//   initializeControls() {
//     const startBtn = document.getElementById("start");
//     if (startBtn) {
//       startBtn.addEventListener("click", async () => {
//         await Tone.start();
//         startBtn.disabled = true;
//         this.onStartCallback?.();
//       });
//     }
//   }

//   onStart(callback) {
//     this.onStartCallback = callback;
//   }

//   initializeSection() {
//     if (TESTING.SKIP_TO_SECTION !== null && TESTING.SKIP_TO_SECTION >= 0) {
//       this.currentSection = TESTING.SKIP_TO_SECTION;
//       console.log(`SKIPPING TO SECTION ${TESTING.SKIP_TO_SECTION} FOR TESTING`);
//     }
//   }
// }
