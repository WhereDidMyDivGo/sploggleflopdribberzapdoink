import { bassPatterns, acidPatterns, kickPatterns, drumPatterns } from "./patterns/index.js";
import { muteAllAndClear } from "./config.js";

export const TESTING = {
  SKIP_TO_SECTION: null,
  TEST_MODE: true,
  AUTO_START: false,
};

export function setupTestPatterns(synthsAndSequences) {
  if (!TESTING.TEST_MODE) return;

  muteAllAndClear(synthsAndSequences);
  const { bassSeq, acidSeq, kickSeq, snareSeq, percSeq, techLeadSeq, techStabSeq, bassGain, kickGain, hatGain, acidGain, buildupGain, buildupNoise, buildupFilter, acid, bass, drumsMixer, filterLfo } = synthsAndSequences;

  bassSeq.mute = false;
  bassGain.gain.value = 1;

  bassSeq.events = bassPatterns[4];
  setTimeout(() => {
    bassSeq.events = bassPatterns[5];
    console.log("p2");
  }, 7500);

  setTimeout(() => {
    bassSeq.events = bassPatterns[6];
    console.log("p3");
  }, 14000);

  setTimeout(() => {
    bassSeq.events = bassPatterns[5];
    console.log("p2");
  }, 15875);

  setTimeout(() => {
    bassSeq.events = bassPatterns[7];
    console.log("p4");
  }, 21500);

  setTimeout(() => {
    bassSeq.events = bassPatterns[8];
    kickSeq.events = kickPatterns[5];
    console.log("p5");
  }, 37375);

  setTimeout(() => {
    bassSeq.events = bassPatterns[9];
    console.log("p6");
  }, 44875);

  setTimeout(() => {
    bassSeq.events = bassPatterns[10];
    console.log("p7");
  }, 52000);

  setTimeout(() => {
    bassSeq.events = bassPatterns[11];
    console.log("p8");
  }, 59500);

  kickSeq.mute = false;
  kickSeq.events = kickPatterns[6];
  kickGain.gain.value = 1.2;
}
