import * as Tone from "https://cdn.skypack.dev/tone@15.1.22";
import { bassPatterns, acidPatterns, kickPatterns, drumPatterns } from "./patterns/index.js";

export class BeatManager {
  constructor(synthsAndSequences) {
    this.synths = synthsAndSequences;
  }

  updateProgression(section) {
    const { bassSeq, acidSeq, kickSeq, snareSeq, percSeq, techLeadSeq, techStabSeq, bassGain, kickGain, hatGain, acidGain, buildupGain, buildupNoise, buildupFilter, acid, bass, drumsMixer } = this.synths;

    switch (section) {
      case 0:
        console.log("Section 0: Minimal start - Just bass and hats (2 loops)");

        bassSeq.events = bassPatterns[0];
        kickSeq.events = kickPatterns[0];

        acidSeq.mute = true;
        kickSeq.mute = true;
        snareSeq.mute = true;
        percSeq.mute = true;

        bassGain.gain.value = 0;
        kickGain.gain.value = 0;
        hatGain.gain.value = 0;

        setTimeout(() => {
          bassGain.gain.rampTo(0.5, 2);
        }, 0);

        setTimeout(() => {
          hatGain.gain.rampTo(0.1, 2);
        }, 3000);

        setTimeout(() => {
          kickSeq.mute = false;
          kickGain.gain.rampTo(1.0, 2);
        }, 7500);

        setTimeout(() => {
          bassSeq.mute = true;
          kickSeq.mute = true;
        }, 14000);
        break;

      case 1:
        console.log("Section 1: Smooth Intro - Gradual buildup with acid introduction (4 loops)");

        acidSeq.events = acidPatterns[0];

        bassSeq.mute = false;
        kickSeq.mute = false;
        acidSeq.mute = false;

        acidGain.gain.rampTo(0.4, 3);
        acid.filter.Q.rampTo(15, 3);

        setTimeout(() => {
          acidSeq.mute = true;
        }, 14500);

        setTimeout(() => {
          acidSeq.mute = false;
        }, 15000);

        setTimeout(() => {
          acidSeq.mute = true;
        }, 29500);

        setTimeout(() => {
          acidSeq.mute = false;
        }, 30000);
        break;

      case 2:
        console.log("Section 2: Filter sweeps and acid variation (2 loops)");
        acidSeq.mute = false;
        acid.filter.Q.rampTo(15, 2);
        // Access filterLfo from synths object
        if (this.synths.filterLfo) {
          this.synths.filterLfo.frequency.rampTo(0.5, 4);
        }
        acidSeq.events = acidPatterns[1];
        acidGain.gain.rampTo(0.8, 2);
        break;

      case 3:
        console.log("Section 3: Bass variation and syncopation (2 loops)");
        acid.filter.Q.rampTo(15, 1);
        bassSeq.events = bassPatterns[1];
        bass.filterEnvelope.octaves = 6;
        bassGain.gain.rampTo(1.3, 2);
        break;

      case 4:
        console.log("Section 5: Buildup - accelerating kicks + noise swell (1 loop)");
        acidSeq.mute = true;
        bassGain.gain.rampTo(0.3, 0.5);
        hatGain.gain.rampTo(0.05, 0.5);
        snareSeq.mute = true;

        buildupNoise.triggerAttack();
        buildupGain.gain.rampTo(0.6, 4);
        buildupFilter.frequency.rampTo(8000, 4);

        setTimeout(() => (kickSeq.events = kickPatterns[4]), 0);
        setTimeout(() => (kickSeq.events = kickPatterns[5]), 1000);
        setTimeout(() => (kickSeq.events = kickPatterns[6]), 2000);
        setTimeout(() => (kickSeq.events = kickPatterns[7]), 3000);
        break;

      case 5:
        console.log("Section 6: Intense buildup - faster drums + white noise crescendo (1 loop)");

        buildupFilter.frequency.rampTo(12000, 2);
        buildupGain.gain.rampTo(0.9, 2);
        acidSeq.mute = true;

        setTimeout(() => {
          kickSeq.events = kickPatterns[8];
        }, 500);

        setTimeout(() => {
          kickGain.gain.rampTo(2.2, 0.5);
        }, 3000);

        setTimeout(() => {
          kickSeq.mute = true;
          buildupGain.gain.rampTo(0, 0.5);
        }, 6500);
        break;

      case 6:
        console.log("Section 7: Hard Techno Drop (1 loop)");

        buildupNoise.triggerAttack();
        acidSeq.mute = true;
        bassSeq.mute = true;
        kickSeq.mute = true;
        drumsMixer.gain.value = 0;

        setTimeout(() => {
          buildupGain.gain.value = 1.2;
          buildupGain.gain.rampTo(0, 7.5);
        }, 500);

        //
        acid.filter.Q.rampTo(15, 2);
        kickSeq.events = kickPatterns[1];
        snareSeq.mute = false;
        kickGain.gain.rampTo(1.8, 2);
        //
        break;

      case 7:
        break;

      case 8:
        break;
    }
  }

  // BPM modulation logic
  updateBPM() {
    Tone.getTransport().bpm.rampTo(128 + Math.sin(Tone.getTransport().seconds * 0.1) * 8, 4);
  }
}
