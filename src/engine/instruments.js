const Tone = window.Tone;

export const INSTRUMENT_PRESETS = {
  kicks: {
    "kick-808": {
      type: "MembraneSynth",
      config: {
        pitchDecay: 0.05,
        octaves: 10,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
      },
      note: "C0",
      effects: [],
    },

    "kick-sub": {
      type: "MembraneSynth",
      config: {
        pitchDecay: 0.02,
        octaves: 4,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.5 },
      },
      note: "C0",
      effects: [{ type: "lowpass", frequency: 80 }],
    },

    "kick-hard": {
      type: "MembraneSynth",
      config: {
        pitchDecay: 0.08,
        octaves: 6,
        oscillator: { type: "square" },
        envelope: { attack: 0.001, decay: 0.3, sustain: 0.01, release: 0.8 },
      },
      note: "C1",
      effects: [{ type: "distortion", amount: 0.4 }],
    },

    "kick-acoustic": {
      type: "MembraneSynth",
      config: {
        pitchDecay: 0.1,
        octaves: 8,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 0.6, sustain: 0, release: 1.2 },
      },
      note: "C1",
      effects: [{ type: "compressor", threshold: -20, ratio: 4 }],
    },
  },

  bass: {
    "bass-reese": {
      type: "MonoSynth",
      config: {
        oscillator: { type: "sawtooth" },
        filter: { Q: 6, type: "lowpass", rolloff: -24 },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 },
        filterEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.4, baseFrequency: 80, octaves: 4 },
      },
      effects: [{ type: "distortion", amount: 0.2 }],
    },

    "bass-acid": {
      type: "MonoSynth",
      config: {
        oscillator: { type: "sawtooth" },
        filter: { Q: 15, type: "lowpass", rolloff: -24 },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.2 },
        filterEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.3, baseFrequency: 200, octaves: 5 },
      },
      effects: [
        { type: "delay", time: "8n", feedback: 0.2 },
        { type: "lfo", target: "filter.frequency", frequency: 0.3, min: 400, max: 1200 },
      ],
    },

    "bass-sub": {
      type: "MonoSynth",
      config: {
        oscillator: { type: "sine" },
        filter: { Q: 2, type: "lowpass", frequency: 120 },
        envelope: { attack: 0.02, decay: 0.1, sustain: 0.8, release: 0.6 },
      },
      effects: [],
    },

    "bass-pluck": {
      type: "PluckSynth",
      config: {
        attackNoise: 1,
        dampening: 4000,
        resonance: 0.7,
      },
      effects: [{ type: "compressor", threshold: -15, ratio: 3 }],
    },
  },

  leads: {
    "acid-303": {
      type: "MonoSynth",
      config: {
        oscillator: { type: "sawtooth" },
        filter: { Q: 15, type: "lowpass", rolloff: -24 },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.2 },
        filterEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.3, baseFrequency: 200, octaves: 5 },
      },
      effects: [
        { type: "delay", time: "8n", feedback: 0.2 },
        { type: "lfo", target: "detune", frequency: 0.2, min: -12, max: 12 },
      ],
    },

    "fm-bell": {
      type: "FMSynth",
      config: {
        harmonicity: 3.01,
        modulationIndex: 14,
        oscillator: { type: "sine" },
        envelope: { attack: 0.2, decay: 0.3, sustain: 0.1, release: 1.2 },
        modulation: { type: "square" },
        modulationEnvelope: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 0.1 },
      },
      effects: [{ type: "reverb", roomSize: 0.8, wet: 0.3 }],
    },

    "saw-lead": {
      type: "MonoSynth",
      config: {
        oscillator: { type: "sawtooth" },
        filter: { Q: 8, type: "lowpass", rolloff: -24 },
        envelope: { attack: 0.02, decay: 0.3, sustain: 0.2, release: 0.4 },
      },
      effects: [{ type: "delay", time: "16n", feedback: 0.15 }],
    },

    "pluck-lead": {
      type: "PluckSynth",
      config: {
        attackNoise: 1,
        dampening: 4000,
        resonance: 0.9,
      },
      effects: [
        { type: "delay", time: "8n", feedback: 0.3 },
        { type: "reverb", roomSize: 0.4, wet: 0.2 },
      ],
    },
  },

  pads: {
    "pad-warm": {
      type: "PolySynth",
      config: {
        oscillator: { type: "sawtooth" },
        filter: { Q: 1, type: "lowpass", frequency: 800 },
        envelope: { attack: 0.8, decay: 0.2, sustain: 0.7, release: 2.0 },
      },
      effects: [
        { type: "reverb", roomSize: 1.2, wet: 0.4 },
        { type: "chorus", frequency: 0.5, depth: 0.7 },
      ],
    },

    "pad-ambient": {
      type: "PolySynth",
      config: {
        oscillator: { type: "sine" },
        envelope: { attack: 1.5, decay: 0.1, sustain: 0.9, release: 3.0 },
      },
      effects: [
        { type: "reverb", roomSize: 2.0, wet: 0.6 },
        { type: "lfo", target: "filter.frequency", frequency: 0.1, min: 400, max: 1600 },
      ],
    },

    strings: {
      type: "PolySynth",
      config: {
        oscillator: { type: "sawtooth" },
        filter: { Q: 3, type: "lowpass", frequency: 1200 },
        envelope: { attack: 0.6, decay: 0.1, sustain: 0.8, release: 1.5 },
      },
      effects: [
        { type: "reverb", roomSize: 1.0, wet: 0.3 },
        { type: "chorus", frequency: 0.3, depth: 0.5 },
      ],
    },

    choir: {
      type: "PolySynth",
      config: {
        oscillator: { type: "sine" },
        envelope: { attack: 1.0, decay: 0.2, sustain: 0.6, release: 2.0 },
      },
      effects: [
        { type: "reverb", roomSize: 1.8, wet: 0.5 },
        { type: "chorus", frequency: 0.2, depth: 0.8 },
      ],
    },
  },

  drums: {
    "snare-clap": {
      type: "NoiseSynth",
      config: {
        noise: { type: "pink" },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0 },
      },
      effects: [{ type: "highpass", frequency: 200 }],
    },

    "snare-acoustic": {
      type: "NoiseSynth",
      config: {
        noise: { type: "brown" },
        envelope: { attack: 0.005, decay: 0.15, sustain: 0 },
      },
      effects: [
        { type: "bandpass", frequency: 300, Q: 2 },
        { type: "compressor", threshold: -18, ratio: 4 },
      ],
    },

    "hat-closed": {
      type: "NoiseSynth",
      config: {
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
      },
      effects: [{ type: "highpass", frequency: 8000 }],
    },

    "hat-open": {
      type: "NoiseSynth",
      config: {
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.3, sustain: 0 },
      },
      effects: [{ type: "highpass", frequency: 6000 }],
    },

    "perc-shaker": {
      type: "NoiseSynth",
      config: {
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0 },
      },
      effects: [
        { type: "bandpass", frequency: 4000, Q: 3 },
        { type: "reverb", roomSize: 0.2, wet: 0.1 },
      ],
    },
  },

  fx: {
    "sweep-up": {
      type: "NoiseSynth",
      config: {
        noise: { type: "white" },
        envelope: { attack: 0.1, decay: 0.1, sustain: 1.0, release: 2.0 },
      },
      effects: [
        { type: "highpass", frequency: 2000 },
        { type: "lfo", target: "filter.frequency", frequency: 0.5, min: 2000, max: 8000 },
      ],
    },

    "sweep-down": {
      type: "NoiseSynth",
      config: {
        noise: { type: "white" },
        envelope: { attack: 0.1, decay: 0.1, sustain: 1.0, release: 2.0 },
      },
      effects: [
        { type: "lowpass", frequency: 8000 },
        { type: "lfo", target: "filter.frequency", frequency: 0.5, min: 200, max: 8000, direction: "down" },
      ],
    },

    impact: {
      type: "NoiseSynth",
      config: {
        noise: { type: "brown" },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0.2, release: 0.5 },
      },
      effects: [
        { type: "distortion", amount: 0.6 },
        { type: "compressor", threshold: -10, ratio: 8 },
      ],
    },

    riser: {
      type: "NoiseSynth",
      config: {
        noise: { type: "pink" },
        envelope: { attack: 2.0, decay: 0.1, sustain: 0.8, release: 1.0 },
      },
      effects: [
        { type: "bandpass", frequency: 1000, Q: 4 },
        { type: "lfo", target: "filter.frequency", frequency: 0.2, min: 500, max: 4000 },
      ],
    },
  },
};

export function createInstrument(presetName, customConfig = {}) {
  const [category] = presetName.split("-");

  const categoryMap = {
    kick: "kicks",
    bass: "bass",
    acid: "leads",
    fm: "leads",
    saw: "leads",
    pluck: "leads",
    pad: "pads",
    strings: "pads",
    choir: "pads",
    snare: "drums",
    hat: "drums",
    perc: "drums",
    sweep: "fx",
    impact: "fx",
    riser: "fx",
  };

  const categoryKey = categoryMap[category] || category + "s";
  const preset = INSTRUMENT_PRESETS[categoryKey]?.[presetName];

  if (!preset) {
    throw new Error(`Instrument preset "${presetName}" not found`);
  }

  const config = { ...preset.config, ...customConfig.synthesis };

  let instrument;
  switch (preset.type) {
    case "MembraneSynth":
      instrument = new Tone.MembraneSynth(config);
      break;
    case "MonoSynth":
      instrument = new Tone.MonoSynth(config);
      break;
    case "FMSynth":
      instrument = new Tone.FMSynth(config);
      break;
    case "PluckSynth":
      instrument = new Tone.PluckSynth(config);
      break;
    case "PolySynth":
      instrument = new Tone.PolySynth(Tone.Synth, config);
      break;
    case "NoiseSynth":
      instrument = new Tone.NoiseSynth(config);
      break;
    default:
      throw new Error(`Unknown instrument type: ${preset.type}`);
  }

  return {
    instrument,
    preset,
    defaultNote: preset.note || "C3",
  };
}
