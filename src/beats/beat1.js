import { registerBeat } from "./index.js";

export const beat1 = {
  name: "techno",
  bpm: 128,
  globalEffects: ["compressor"],

  sections: [
    {
      name: "beat",
      bars: 8,
      instruments: {
        kick: {
          type: "kick-808",
          pattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          volume: 1.2,
        },

        bass: {
          type: "bass-reese",
          pattern: ["C1", "C2", null, null, "F1", null, "F2", null, "C1", "C2", null, null, "Bb0", null, "Bb1", null],
          volume: 0.9,
          effects: [
            { type: "distortion", amount: 0.2 },
            { type: "filter", frequency: 800 },
          ],
        },

        hat: {
          type: "hat-closed",
          pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          volume: 0.4,
        },

        snare: {
          type: "snare-clap",
          pattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          volume: 0.6,
        },

        sweep: {
          type: "sweep-up",
          pattern: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          volume: 0.4,
        },
      },
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    {
      name: "test",
      bars: 8,
      instruments: {
        kick: {
          type: "kick-sub",
          pattern: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
          volume: 0.8,
        },

        bass: {
          type: "bass-pluck",
          pattern: ["C1", null, "Eb1", null, "F1", null, "G1", null, "F1", null, "Eb1", null, "C1", null, null, null],
          volume: 0.6,
          effects: [{ type: "reverb", roomSize: 0.6, wet: 0.3 }],
        },

        lead: {
          type: "fm-bell",
          pattern: [{ pitch: "C4", velocity: 0.4 }, null, null, null, { pitch: "Eb4", velocity: 0.3 }, null, null, null, { pitch: "F4", velocity: 0.5 }, null, null, null, { pitch: "C4", velocity: 0.4 }, null, null, null],
          volume: 0.5,
          effects: [
            { type: "delay", time: "4n", feedback: 0.4 },
            { type: "reverb", roomSize: 1.0, wet: 0.4 },
          ],
        },

        pad: {
          type: "pad-ambient",
          pattern: ["C3", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          volume: 0.6,
          automation: {
            "filter.frequency": { type: "lfo", rate: 0.1, min: 400, max: 1600 },
          },
        },
      },
    },
    //////////////////////////////////////////////////////////////////////////////////////////
    {
      name: "daehrwx3gjktuyghjyrtcefsacfgerstwuyfgrtv68kdceuaq3VTO786BC",
      bars: 8,
      instruments: {
        kick: {
          type: "kick-hard",
          pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          volume: 1.3,
        },

        bass: {
          type: "bass-reese",
          pattern: ["C1", null, "C1", null, "G1", null, "F1", null, "C1", null, "C1", null, "Bb0", null, "F1", null],
          volume: 1.0,
          effects: [{ type: "distortion", amount: 0.3 }],
          automation: {
            "filter.frequency": { type: "lfo", rate: 0.25, min: 400, max: 1200 },
          },
        },

        lead: {
          type: "acid-303",
          pattern: [{ pitch: "C3", velocity: 0.8 }, null, { pitch: "Eb3", velocity: 0.7 }, { pitch: "G3", velocity: 0.9 }, null, { pitch: "F3", velocity: 0.8 }, null, null],
          volume: 0.7,
          effects: [{ type: "delay", time: "8n", feedback: 0.35 }],
        },

        hat: {
          type: "hat-open",
          pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          volume: 0.5,
        },

        sweep: {
          type: "sweep-up",
          pattern: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          volume: 0.6,
        },
      },
    },
  ],
};

registerBeat(beat1);
