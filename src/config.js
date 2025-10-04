export const CONFIG = {
  BPM: 128,
  LOOP_LENGTH: "4m",
  REVERB_WET: 0.15,
  REVERB_ROOM_SIZE: 1.2,
  COMPRESSOR_THRESHOLD: -12,
  COMPRESSOR_RATIO: 3,
};

export const SYNTH_CONFIGS = {
  kick: {
    pitchDecay: 0.08,
    octaves: 6,
    envelope: {
      attack: 0.001,
      decay: 0.3,
      sustain: 0.01,
      release: 0.8,
    },
  },

  bass: {
    oscillator: { type: "sawtooth" },
    filter: {
      Q: 6,
      type: "lowpass",
      rolloff: -12,
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.3,
      release: 0.5,
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0.2,
      release: 0.4,
      baseFrequency: 80,
      octaves: 4,
    },
  },

  acid: {
    oscillator: { type: "sawtooth" },
    filter: {
      Q: 15,
      type: "lowpass",
      rolloff: -24,
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.1,
      release: 0.2,
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0.1,
      release: 0.3,
      baseFrequency: 200,
      octaves: 5,
    },
  },

  buildupNoise: {
    noise: { type: "white" },
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 1.0,
      release: 2.0,
    },
  },

  techLead: {
    oscillator: { type: "square" },
    filter: {
      Q: 8,
      type: "lowpass",
      rolloff: -24,
    },
    envelope: {
      attack: 0.02,
      decay: 0.3,
      sustain: 0.2,
      release: 0.4,
    },
  },

  techStab: {
    oscillator: { type: "sawtooth" },
    filter: {
      Q: 4,
      type: "lowpass",
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.0,
      release: 0.1,
    },
  },

  hat: {
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
  },

  snare: {
    noise: { type: "pink" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0 },
  },

  perc: {
    noise: { type: "brown" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0 },
  },
};

export const GAIN_LEVELS = {
  kick: 1.5,
  bass: 0.9,
  acid: 0.6,
  buildup: 0.0,
  tech: 0.8,
  stab: 0.6,
  hat: 0.2,
  snare: 0.4,
  perc: 0.3,
  drums: 1.0,
};

export const EFFECTS_CONFIG = {
  acidDelay: {
    delay: "8n",
    feedback: 0.2,
  },
  techDelay: {
    delay: "16n",
    feedback: 0.15,
  },
  buildupFilter: {
    frequency: 2000,
    type: "highpass",
    rolloff: -12,
  },
  pitchLfo: {
    frequency: 0.2,
    min: -12,
    max: 12,
  },
  filterLfo: {
    frequency: 0.3,
    min: 400,
    max: 1200,
  },
};
