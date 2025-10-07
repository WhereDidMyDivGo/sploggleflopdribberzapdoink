// import * as Tone from "https://cdn.skypack.dev/tone@15.1.22";
// import { bassPatterns, acidPatterns, kickPatterns, drumPatterns } from "./patterns/index.js";
// import { CONFIG, muteAllAndClear } from "./config.js";
// import { TESTING, setupTestPatterns } from "./testing.js";

// export class BeatManager {
//   constructor(synthsAndSequences) {
//     this.synths = synthsAndSequences;
//     this.activeTimeouts = [];
//     this.maxLoopPerSection = new Map();
//   }

//   clearTimeouts() {
//     this.activeTimeouts.forEach((timeout) => clearTimeout(timeout));
//     this.activeTimeouts = [];
//   }

//   loop(loopNumbers, callback) {
//     const loops = Array.isArray(loopNumbers) ? loopNumbers : [loopNumbers];

//     loops.forEach((loopNumber) => {
//       const delay = (loopNumber - 1) * 1875;
//       const timeout = setTimeout(() => {
//         callback(loopNumber);
//       }, delay);
//       this.activeTimeouts.push(timeout);
//     });

//     const maxLoop = Math.max(...loops);
//     const currentMax = this.maxLoopPerSection.get(this.currentSection) || 0;
//     this.maxLoopPerSection.set(this.currentSection, Math.max(currentMax, maxLoop));
//   }

//   getSectionLength(sectionIndex) {
//     return this.maxLoopPerSection.get(sectionIndex) || 1;
//   }

//   playSection(section) {
//     this.clearTimeouts();
//     this.currentSection = section;
//     this.maxLoopPerSection.delete(section);

//     if (TESTING.TEST_MODE) {
//       setupTestPatterns(this.synths);
//       return;
//     }

//     muteAllAndClear(this.synths);

//     const { bassSeq, acidSeq, kickSeq, snareSeq, percSeq, techLeadSeq, techStabSeq, bassGain, kickGain, hatGain, acidGain, buildupGain, buildupNoise, buildupFilter, acid, bass, drumsMixer, filterLfo } = this.synths;

//     switch (section) {
//       case 0:
//         this.loop([1, 3, 5, 7], () => {
//           console.log("case 0 loop 1 3 5 7");
//           // bassSeq.mute = false;
//           // bassGain.gain.value = 1;
//           // bassSeq.events = bassPatterns[4];
//         });

//         this.loop([2, 4, 8, 9], () => {
//           console.log("case 0 loop 2 4 8 9");
//         });
//         break;

//       case 1:
//         this.loop([1, 3, 5, 7], () => {
//           console.log("case 1 loop 1 3 5 7");
//         });

//         this.loop([2, 4, 8], () => {
//           console.log("case 1 loop 2 4 8");
//         });
//         break;

//       case 2:
//         this.loop([1, 3, 5, 7], () => {
//           console.log("case 2 loop 1 3 5 7");
//         });

//         this.loop([2, 4, 8], () => {
//           console.log("case 2 loop 2 4 8");
//         });
//         break;

//       case 3:
//         this.loop([1, 3, 5, 7], () => {
//           console.log("case 3 loop 1 3 5 7");
//         });

//         this.loop([2, 4, 8], () => {
//           console.log("case 3 loop 2 4 8");
//         });
//         break;

//       case 4:
//         this.loop([1, 3, 5, 7], () => {
//           console.log("case 4 loop 1 3 5 7");
//         });

//         this.loop([2, 4, 8], () => {
//           console.log("case 4 loop 2 4 8");
//         });
//         break;

//       case 5:
//         this.loop([1, 3, 5, 7], () => {
//           console.log("case 5 loop 1 3 5 7");
//         });

//         this.loop([2, 4, 8], () => {
//           console.log("case 5 loop 2 4 8");
//         });
//         break;

//       case 6:
//         this.loop([1, 3, 5, 7], () => {
//           console.log("case 6 loop 1 3 5 7");
//         });

//         this.loop([2, 4, 8], () => {
//           console.log("case 6 loop 2 4 8");
//         });
//         break;

//       case 7:
//         this.loop([1, 3, 5, 7], () => {
//           console.log("case 7 loop 1 3 5 7");
//         });

//         this.loop([2, 4, 8], () => {
//           console.log("case 7 loop 2 4 8");
//         });
//         break;

//       case 8:
//         this.loop([1, 3, 5, 7], () => {
//           console.log("case 8 loop 1 3 5 7");
//         });

//         this.loop([2, 4, 8], () => {
//           console.log("case 8 loop 2 4 8");
//         });
//         break;
//     }
//   }

//   updateBPM() {
//     Tone.getTransport().bpm.rampTo(128 + Math.sin(Tone.getTransport().seconds * 0.1) * 8, 4);
//   }
// }
