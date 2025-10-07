const Tone = window.Tone;
import { AudioEngine } from "./audioEngine.js";

export class BeatSystem {
  constructor() {
    this.engine = new AudioEngine();
    this.currentBeat = null;
    this.currentSection = 0;
    this.isPlaying = false;
    this.sectionTimeouts = [];
    this.loopDuration = 0;
    this.arrangementMode = false;
    this.arrangementIndex = 0;
    this.currentRepeat = 0;
    this.arrangementTimeout = null;
    this.songFinishedCallback = null;
  }

  async initialize() {
    await this.engine.initialize();
    this.setupTransport();
  }

  setupTransport() {
    Tone.getTransport().loop = true;
    Tone.getTransport().loopStart = 0;
    Tone.getTransport().loopEnd = "4m";
  }

  async loadBeat(beatDefinition) {
    if (!beatDefinition) {
      throw new Error("No beat definition provided");
    }

    if (!beatDefinition.sections || !Array.isArray(beatDefinition.sections)) {
      throw new Error("Beat definition must have sections array");
    }

    this.clearCurrentBeat();
    this.currentBeat = beatDefinition;

    this.engine.updateBPM(beatDefinition.bpm || 128);
    this.calculateLoopDuration(beatDefinition.bpm || 128);

    await this.setupGlobalEffects(beatDefinition.globalEffects);
    await this.setupAllSections(beatDefinition.sections);

    return this.currentBeat;
  }
  calculateLoopDuration(bpm) {
    this.loopDuration = (60 / bpm) * 4 * 1000;
  }

  async setupGlobalEffects(globalEffects = []) {
    // global effects setup would go here
  }

  async setupAllSections(sections) {
    for (let i = 0; i < sections.length; i++) {
      await this.setupSection(sections[i], i);
    }
  }

  async setupSection(section, sectionIndex) {
    const { instruments = {} } = section;

    for (const [instrumentId, config] of Object.entries(instruments)) {
      await this.setupInstrument(instrumentId, config, sectionIndex);
    }
  }
  async setupInstrument(instrumentId, config, sectionIndex) {
    const fullInstrumentId = `${instrumentId}_${sectionIndex}`;

    if (typeof config === "string") {
      config = { type: config };
    }

    if (Array.isArray(config)) {
      for (let i = 0; i < config.length; i++) {
        const subId = `${fullInstrumentId}_${i}`;
        this.engine.createInstrumentInstance(subId, { type: config[i] });
      }
      return;
    }

    try {
      this.engine.createInstrumentInstance(fullInstrumentId, config);

      if (config.pattern) {
        const sequenceId = `seq_${fullInstrumentId}`;
        this.engine.createSequence(sequenceId, fullInstrumentId, config.pattern, config.noteLength);
      }
    } catch (error) {
      console.error(fullInstrumentId + error + "setupp");
      throw error;
    }
  }

  playSection(sectionIndex) {
    if (!this.currentBeat || !this.currentBeat.sections[sectionIndex]) {
      console.error(sectionIndex + "thisthisthisthisthisthisthisthisthisthisthisthisthisthisthisthisthisthisthisthisthisthisthisthisthisthis");
      return;
    }

    this.clearSectionTimeouts();
    this.currentSection = sectionIndex;

    this.muteAllInstruments();

    const section = this.currentBeat.sections[sectionIndex];

    this.activateSection(sectionIndex);

    if (section.timeline) {
      this.setupSectionTimeline(section.timeline, sectionIndex, section.bars || 4);
    }
  }

  activateSection(sectionIndex) {
    const section = this.currentBeat.sections[sectionIndex];

    Object.keys(section.instruments || {}).forEach((instrumentId) => {
      const fullInstrumentId = `${instrumentId}_${sectionIndex}`;
      const sequenceId = `seq_${fullInstrumentId}`;

      this.engine.startSequence(sequenceId);
      this.engine.setInstrumentVolume(fullInstrumentId, 1.0);
    });
  }

  setupSectionTimeline(timeline, sectionIndex, totalBars) {
    timeline.forEach((event) => {
      const { bar, beat = 1, action, target, value } = event;
      const timeMs = this.calculateEventTime(bar, beat);

      const timeout = setTimeout(() => {
        this.executeTimelineAction(action, target, value, sectionIndex);
      }, timeMs);

      this.sectionTimeouts.push(timeout);
    });
  }

  calculateEventTime(bar, beat) {
    return ((bar - 1) * 4 + (beat - 1)) * (this.loopDuration / 16);
  }

  executeTimelineAction(action, target, value, sectionIndex) {
    const fullTarget = `${target}_${sectionIndex}`;

    switch (action) {
      case "start":
        this.engine.startSequence(`seq_${fullTarget}`);
        break;
      case "stop":
        this.engine.stopSequence(`seq_${fullTarget}`);
        break;
      case "volume":
        this.engine.setInstrumentVolume(fullTarget, value);
        break;
      case "pattern":
        this.engine.updateSequencePattern(`seq_${fullTarget}`, value);
        break;
      case "play":
        this.engine.playNote(fullTarget, value.note, value.duration, value.velocity);
        break;
    }
  }

  muteAllInstruments() {
    if (!this.currentBeat || !this.currentBeat.sections) return;

    this.currentBeat.sections.forEach((section, sectionIndex) => {
      Object.keys(section.instruments || {}).forEach((instrumentId) => {
        const fullInstrumentId = `${instrumentId}_${sectionIndex}`;
        this.engine.muteInstrument(fullInstrumentId, true);
      });
    });
  }

  clearSectionTimeouts() {
    this.sectionTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.sectionTimeouts = [];
  }

  clearCurrentBeat() {
    this.clearSectionTimeouts();
    if (this.currentBeat) {
      this.muteAllInstruments();
    }
    this.currentBeat = null;
  }

  nextSection() {
    if (!this.currentBeat) return;

    const nextIndex = (this.currentSection + 1) % this.currentBeat.sections.length;
    this.playSection(nextIndex);
  }

  previousSection() {
    if (!this.currentBeat) return;

    const prevIndex = this.currentSection === 0 ? this.currentBeat.sections.length - 1 : this.currentSection - 1;
    this.playSection(prevIndex);
  }

  start() {
    if (!this.isPlaying) {
      this.engine.start();
      this.isPlaying = true;

      if (this.currentBeat) {
        if (this.currentBeat.arrangement) {
          this.arrangementMode = true;
          this.arrangementIndex = 0;
          this.currentRepeat = 0;
          this.playCurrentArrangementSection();
        } else {
          this.playSection(this.currentSection);
        }
      }
    }
  }

  stop() {
    if (this.isPlaying) {
      this.engine.stop();
      this.clearSectionTimeouts();

      if (this.arrangementTimeout) {
        clearTimeout(this.arrangementTimeout);
        this.arrangementTimeout = null;
      }
      this.arrangementMode = false;

      this.isPlaying = false;
    }
  }

  pause() {
    this.engine.pause();
    this.isPlaying = false;
  }

  setBPM(bpm) {
    this.engine.updateBPM(bpm);
    this.calculateLoopDuration(bpm);

    if (this.currentBeat) {
      this.currentBeat.bpm = bpm;
    }
  }

  setInstrumentVolume(instrumentId, volume) {
    const fullInstrumentId = `${instrumentId}_${this.currentSection}`;
    this.engine.setInstrumentVolume(fullInstrumentId, volume);
  }

  getAnalysers() {
    return this.engine.getAllAnalysers();
  }

  getCurrentSection() {
    return this.currentSection;
  }

  getSectionCount() {
    return this.currentBeat ? this.currentBeat.sections.length : 0;
  }

  getSectionName(index = this.currentSection) {
    if (!this.currentBeat || !this.currentBeat.sections[index]) return `Section ${index}`;
    return this.currentBeat.sections[index].name || `Section ${index}`;
  }

  playCurrentArrangementSection() {
    if (!this.arrangementMode || !this.currentBeat?.arrangement) return;

    if (this.arrangementIndex >= this.currentBeat.arrangement.length) {
      this.arrangementMode = false;
      if (this.songFinishedCallback) {
        this.songFinishedCallback();
      }
      return;
    }

    const step = this.currentBeat.arrangement[this.arrangementIndex];
    const sectionIndex = this.findSectionIndexByName(step.section);

    if (sectionIndex === -1) {
      this.nextArrangementStep();
      return;
    }

    this.playSection(sectionIndex);

    const section = this.currentBeat.sections[sectionIndex];
    const sectionDurationMs = this.calculateSectionDuration(section.bars || 4);

    this.arrangementTimeout = setTimeout(() => {
      this.onArrangementSectionComplete();
    }, sectionDurationMs);
  }

  onArrangementSectionComplete() {
    const currentStep = this.currentBeat.arrangement[this.arrangementIndex];
    this.currentRepeat++;

    if (this.currentRepeat >= currentStep.repeat) {
      this.nextArrangementStep();
    } else {
      this.playCurrentArrangementSection();
    }
  }

  nextArrangementStep() {
    this.arrangementIndex++;
    this.currentRepeat = 0;
    this.playCurrentArrangementSection();
  }

  findSectionIndexByName(sectionName) {
    if (!this.currentBeat?.sections) return -1;
    return this.currentBeat.sections.findIndex((section) => section.name === sectionName);
  }

  calculateSectionDuration(bars) {
    const beatsPerBar = 4;
    const totalBeats = bars * beatsPerBar;
    const bpm = this.currentBeat?.bpm || 128;
    const beatDurationMs = (60 / bpm) * 1000;
    return totalBeats * beatDurationMs;
  }

  getArrangementProgress() {
    if (!this.arrangementMode || !this.currentBeat?.arrangement) {
      return null;
    }

    return {
      currentStep: this.arrangementIndex + 1,
      totalSteps: this.currentBeat.arrangement.length,
      currentSection: this.currentBeat.arrangement[this.arrangementIndex]?.section,
      currentRepeat: this.currentRepeat + 1,
      totalRepeats: this.currentBeat.arrangement[this.arrangementIndex]?.repeat || 1,
      isActive: this.arrangementMode,
    };
  }

  dispose() {
    this.clearSectionTimeouts();
    this.stopSong();
    this.engine.dispose();
  }
}
