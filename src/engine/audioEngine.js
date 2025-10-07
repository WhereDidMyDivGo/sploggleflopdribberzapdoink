const Tone = window.Tone;
import { createInstrument } from "./instruments.js";
import { createEffectChain } from "./effectChains.js";

export class AudioEngine {
  constructor() {
    this.instruments = new Map();
    this.sequences = new Map();
    this.effectChains = new Map();
    this.masterGain = new Tone.Gain(0.8);
    this.compressor = new Tone.Compressor(-12, 3);
    this.masterAnalyser = new Tone.Analyser("waveform", 1024);
    this.isInitialized = false;

    this.setupMasterChain();
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      if (Tone.context.state === "suspended") {
        this.isInitialized = false;
        return;
      }

      await Tone.start();
      this.isInitialized = true;
    } catch (error) {
      this.isInitialized = false;
    }
  }

  setupMasterChain() {
    this.masterGain.chain(this.compressor, this.masterAnalyser);
    this.compressor.toDestination();
  }

  createInstrumentInstance(instrumentId, config) {
    if (typeof config === "string") {
      config = { type: config };
    }

    const { type, effects = [], volume = 1.0, synthesis = {}, automation = {} } = config;
    const { instrument, preset, defaultNote } = createInstrument(type, { synthesis });

    const gain = new Tone.Gain(volume);
    const analyser = new Tone.Analyser("waveform", 512);

    let effectChain = null;
    const allEffects = [...(preset.effects || []), ...effects];

    if (allEffects.length > 0) {
      try {
        effectChain = createEffectChain(allEffects);
        instrument.chain(gain, effectChain.input, analyser, this.masterGain);

        if (automation) {
          this.setupAutomation(instrument, effectChain, automation);
        }
      } catch (error) {
        console.error(`eff chain ${instrumentId}`, error);
        instrument.chain(gain, analyser, this.masterGain);
      }
    } else {
      instrument.chain(gain, analyser, this.masterGain);
    }

    const instance = {
      instrument,
      gain,
      analyser,
      effectChain,
      preset,
      defaultNote,
      config,
    };

    this.instruments.set(instrumentId, instance);
    return instance;
  }

  setupAutomation(instrument, effectChain, automation) {
    Object.entries(automation).forEach(([target, config]) => {
      if (config.type === "lfo") {
        const lfoEffect = {
          type: "lfo",
          target,
          frequency: config.rate || 1,
          min: config.min || 0,
          max: config.max || 1,
          depth: config.depth,
        };

        const lfo = effectChain.addEffect(lfoEffect);
        effectChain.connectLFOs(instrument);
      }
    });
  }

  createSequence(sequenceId, instrumentId, pattern, noteLength = "16n") {
    const instrumentInstance = this.instruments.get(instrumentId);
    if (!instrumentInstance) {
      throw new Error(`Instrument ${instrumentId} not found`);
    }

    const { instrument, defaultNote } = instrumentInstance;

    const sequence = new Tone.Sequence(
      (time, step) => {
        if (!step) return;

        if (typeof step === "string") {
          instrument.triggerAttackRelease(step, noteLength, time);
        } else if (typeof step === "object" && step.pitch) {
          instrument.triggerAttackRelease(step.pitch, noteLength, time, step.velocity);
        } else if (step === 1 || step === true) {
          // console.log("step: " + step);
          // console.log("instrument: " + instrument);
          // console.log("defaultNote: " + defaultNote);
          // console.log("noteLength: " + noteLength);
          // console.log("time: " + time);
          instrument.triggerAttackRelease(defaultNote, noteLength, time);
        }
      },
      pattern,
      noteLength
    );

    sequence.mute = true;

    this.sequences.set(sequenceId, {
      sequence,
      instrumentId,
      pattern,
      noteLength,
    });

    return sequence;
  }

  createContinuousInstrument(instrumentId, config) {
    const instance = this.createInstrumentInstance(instrumentId, config);
    return instance;
  }

  updateBPM(bpm) {
    Tone.getTransport().bpm.rampTo(bpm, 0.5);
  }

  setInstrumentVolume(instrumentId, volume) {
    const instance = this.instruments.get(instrumentId);
    if (instance) {
      instance.gain.gain.rampTo(volume, 0.1);
    } else {
      console.error(instrumentId + "not found?");
    }
  }

  muteInstrument(instrumentId, muted = true) {
    const sequences = Array.from(this.sequences.values()).filter((seq) => seq.instrumentId === instrumentId);

    sequences.forEach(({ sequence }) => {
      sequence.mute = muted;
    });
  }

  playNote(instrumentId, note, duration = "8n", velocity = 1) {
    const instance = this.instruments.get(instrumentId);
    if (instance) {
      instance.instrument.triggerAttackRelease(note, duration, Tone.now(), velocity);
    }
  }

  startSequence(sequenceId) {
    const sequenceData = this.sequences.get(sequenceId);
    if (sequenceData) {
      const { sequence } = sequenceData;

      if (sequence.state === "stopped") {
        sequence.start(0);
      }
      sequence.mute = false;
    } else {
      console.error(sequenceId + "bghjydacbghjcdawbghw");
    }
  }

  stopSequence(sequenceId) {
    const sequenceData = this.sequences.get(sequenceId);
    if (sequenceData) {
      sequenceData.sequence.mute = true;
    }
  }

  updateSequencePattern(sequenceId, newPattern) {
    const sequenceData = this.sequences.get(sequenceId);
    if (sequenceData) {
      sequenceData.sequence.events = newPattern;
      sequenceData.pattern = newPattern;
    }
  }

  start() {
    Tone.getTransport().start();

    this.sequences.forEach((sequenceData, sequenceId) => {
      if (!sequenceData.sequence.mute && sequenceData.sequence.state === "stopped") {
        sequenceData.sequence.start(0);
      }
    });
  }

  stop() {
    Tone.getTransport().stop();
  }

  pause() {
    Tone.getTransport().pause();
  }

  getAnalyser(instrumentId) {
    const instance = this.instruments.get(instrumentId);
    return instance ? instance.analyser : null;
  }

  getMasterAnalyser() {
    return this.masterAnalyser;
  }

  getAllAnalysers() {
    const analysers = { master: this.masterAnalyser };

    this.instruments.forEach((instance, id) => {
      analysers[id] = instance.analyser;
    });

    return analysers;
  }

  dispose() {
    this.sequences.forEach(({ sequence }) => sequence.dispose());
    this.instruments.forEach((instance) => {
      instance.instrument.dispose();
      instance.gain.dispose();
      instance.analyser.dispose();
      if (instance.effectChain) {
        instance.effectChain.dispose();
      }
    });

    this.masterGain.dispose();
    this.compressor.dispose();
    this.masterAnalyser.dispose();

    this.instruments.clear();
    this.sequences.clear();
    this.effectChains.clear();
  }
}
