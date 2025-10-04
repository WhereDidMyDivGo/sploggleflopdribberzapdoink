import * as Tone from "https://cdn.skypack.dev/tone@15.1.22";
import { bassPatterns, acidPatterns, kickPatterns, techLeadPattern, techStabPattern, drumPatterns } from "./patterns/index.js";
import { Controls } from "./controls.js";
import { BeatManager } from "./beats.js";
import { CONFIG, SYNTH_CONFIGS, GAIN_LEVELS, EFFECTS_CONFIG, autoStartIfEnabled, startTestMode } from "./config.js";
import { setupVisualizers } from "./visualizers.js";
import { TESTING } from "./testing.js";
import { startPhaseMeter } from "./phaseMeter.js";

const controls = new Controls();

let progressionCount = 0;
let currentSection = 0;
let loopsInCurrentSection = 0;

const startAcid = async () => {
  Tone.getTransport().bpm.value = CONFIG.BPM;
  Tone.getTransport().loop = true;
  Tone.getTransport().loopStart = 0;
  Tone.getTransport().loopEnd = CONFIG.LOOP_LENGTH;

  const comp = new Tone.Compressor(CONFIG.COMPRESSOR_THRESHOLD, CONFIG.COMPRESSOR_RATIO).toDestination();
  const reverb = new Tone.Reverb(CONFIG.REVERB_ROOM_SIZE).connect(comp);
  reverb.wet.value = CONFIG.REVERB_WET;

  const masterAnalyser = new Tone.Analyser("waveform", 1024);
  const kickAnalyser = new Tone.Analyser("fft", 512);
  const bassAnalyser = new Tone.Analyser("fft", 256);
  const acidAnalyser = new Tone.Analyser("waveform", 512);
  const drumsAnalyser = new Tone.Analyser("waveform", 512);

  comp.connect(masterAnalyser);

  const kick = new Tone.MembraneSynth(SYNTH_CONFIGS.kick);
  const kickGain = new Tone.Gain(GAIN_LEVELS.kick);
  kick.chain(kickGain, kickAnalyser, comp);

  const bass = new Tone.MonoSynth(SYNTH_CONFIGS.bass);
  const bassGain = new Tone.Gain(GAIN_LEVELS.bass);
  bass.chain(bassGain, bassAnalyser, comp);

  const acid = new Tone.MonoSynth(SYNTH_CONFIGS.acid);
  const acidGain = new Tone.Gain(GAIN_LEVELS.acid);
  const acidDelay = new Tone.PingPongDelay(EFFECTS_CONFIG.acidDelay.delay, EFFECTS_CONFIG.acidDelay.feedback);
  acid.chain(acidGain, acidDelay, acidAnalyser, reverb);

  const pitchLfo = new Tone.LFO(EFFECTS_CONFIG.pitchLfo.frequency, EFFECTS_CONFIG.pitchLfo.min, EFFECTS_CONFIG.pitchLfo.max).start();
  pitchLfo.connect(acid.detune);

  const filterLfo = new Tone.LFO(EFFECTS_CONFIG.filterLfo.frequency, EFFECTS_CONFIG.filterLfo.min, EFFECTS_CONFIG.filterLfo.max).start();
  filterLfo.connect(acid.filter.frequency);

  const buildupNoise = new Tone.NoiseSynth(SYNTH_CONFIGS.buildupNoise);
  const buildupGain = new Tone.Gain(GAIN_LEVELS.buildup);
  const buildupFilter = new Tone.Filter(EFFECTS_CONFIG.buildupFilter);
  buildupNoise.chain(buildupGain, buildupFilter, reverb);

  const techLead = new Tone.MonoSynth(SYNTH_CONFIGS.techLead);
  const techGain = new Tone.Gain(GAIN_LEVELS.tech);
  const techDelay = new Tone.PingPongDelay(EFFECTS_CONFIG.techDelay.delay, EFFECTS_CONFIG.techDelay.feedback);
  techLead.chain(techGain, techDelay, comp);

  const techStab = new Tone.PolySynth(Tone.Synth, SYNTH_CONFIGS.techStab);
  const stabGain = new Tone.Gain(GAIN_LEVELS.stab);
  techStab.chain(stabGain, comp);

  const techLeadSeq = new Tone.Sequence(
    (time, note) => {
      if (note) {
        techLead.triggerAttackRelease(note, "8n", time);
      }
    },
    techLeadPattern,
    "16n"
  ).start(0);
  techLeadSeq.mute = true;

  const techStabSeq = new Tone.Sequence(
    (time, chord) => {
      if (chord) {
        techStab.triggerAttackRelease(chord[0], "32n", time);
      }
    },
    techStabPattern,
    "16n"
  ).start(0);
  techStabSeq.mute = true;

  const bassSeq = new Tone.Sequence(
    (time, note) => {
      if (note) {
        bass.triggerAttackRelease(note, "8n", time);
      }
    },
    bassPatterns[0],
    "16n"
  ).start(0);

  const acidSeq = new Tone.Sequence(
    (time, note) => {
      if (note) {
        acid.triggerAttackRelease(note.pitch, "16n", time, note.velocity);

        acid.filter.frequency.cancelScheduledValues(time);
        acid.filter.frequency.setValueAtTime(300, time);
        acid.filter.frequency.linearRampToValueAtTime(800 + Math.random() * 1000, time + 0.05);
        acid.filter.frequency.linearRampToValueAtTime(200, time + 0.2);
      }
    },
    acidPatterns[0],
    "16n"
  ).start(0);

  const kickSeq = new Tone.Sequence(
    (time, step) => {
      if (step) {
        kick.triggerAttackRelease("C1", "8n", time);
      }
    },
    kickPatterns[0],
    "16n"
  ).start(0);

  const hat = new Tone.NoiseSynth(SYNTH_CONFIGS.hat);
  const hatGain = new Tone.Gain(GAIN_LEVELS.hat);

  const drumsMixer = new Tone.Gain(GAIN_LEVELS.drums);
  drumsMixer.connect(drumsAnalyser);
  drumsMixer.connect(comp);

  hat.chain(hatGain, drumsMixer);

  const hatSeq = new Tone.Loop((time) => {
    hat.triggerAttackRelease("32n", time);
  }, "8n").start(0);

  const snare = new Tone.NoiseSynth(SYNTH_CONFIGS.snare);
  const snareGain = new Tone.Gain(GAIN_LEVELS.snare);
  snare.chain(snareGain, drumsMixer);

  const snareSeq = new Tone.Sequence(
    (time, hit) => {
      if (hit) {
        snare.triggerAttackRelease("8n", time);
      }
    },
    drumPatterns.snare,
    "16n"
  ).start(0);
  snareSeq.mute = true;

  const perc = new Tone.NoiseSynth(SYNTH_CONFIGS.perc);
  const percGain = new Tone.Gain(GAIN_LEVELS.perc);
  perc.chain(percGain, drumsMixer);

  const percSeq = new Tone.Sequence(
    (time, hit) => {
      if (hit) {
        perc.triggerAttackRelease("32n", time);
      }
    },
    drumPatterns.perc,
    "16n"
  ).start(0);
  percSeq.mute = true;

  const synthsAndSequences = {
    bassSeq,
    acidSeq,
    kickSeq,
    snareSeq,
    percSeq,
    techLeadSeq,
    techStabSeq,
    bassGain,
    kickGain,
    hatGain,
    acidGain,
    buildupGain,
    buildupNoise,
    buildupFilter,
    acid,
    bass,
    drumsMixer,
    filterLfo,
  };

  const beatManager = new BeatManager(synthsAndSequences);

  controls.initializeSection();
  currentSection = controls.currentSection;

  const startBeats = () => {
    Tone.getTransport().start();
    startPhaseMeter();
    beatManager.playSection(currentSection);
  };

  const analyzers = {
    master: masterAnalyser,
    kick: kickAnalyser,
    bass: bassAnalyser,
    acid: acidAnalyser,
    drums: drumsAnalyser,
  };

  setupVisualizers(analyzers);

  window.__tone_analyser = masterAnalyser;
  window.__masterAnalyser = masterAnalyser;
  window.__kickAnalyser = kickAnalyser;
  window.__bassAnalyser = bassAnalyser;
  window.__acidAnalyser = acidAnalyser;
  window.__drumsAnalyser = drumsAnalyser;
  window.__acid = acid;
  window.__kick = kick;
  window.__bass = bass;
  window.__snare = snare;
  window.__progressionCount = () => progressionCount;
  window.__bassPatterns = bassPatterns;
  window.__acidPatterns = acidPatterns;
  window.__kickPatterns = kickPatterns;
  window.__currentSection = () => currentSection;
  window.__loopsInCurrentSection = () => loopsInCurrentSection;

  return {
    analyzers,
    synthsAndSequences,
    startBeats,
  };
};

const main = async () => {
  const { synthsAndSequences, startBeats } = await startAcid();

  if (TESTING.TEST_MODE) {
    controls.onStart(() => {
      Tone.getTransport().start();
      startPhaseMeter();
      startTestMode(synthsAndSequences);
    });
  } else {
    controls.onStart(startBeats);
  }

  autoStartIfEnabled(startBeats, () => {
    Tone.getTransport().start();
    startPhaseMeter();
    startTestMode(synthsAndSequences);
  });
};

main();
