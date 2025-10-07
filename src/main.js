const Tone = window.Tone;
import { getAvailableBeats, loadBeat } from "./beats/index.js";

class SimpleBeatMachine {
  constructor() {
    this.isPlaying = false;
    this.currentBeat = null;
    this.canvas = null;
    this.canvasCtx = null;
    this.sequences = {};
    this.instruments = {};
    this.currentSection = 0;
    this.bpm = 128;
  }

  async initialize() {
    this.createInstruments();
    await this.loadAvailableBeats();
    this.createControls();
    this.setupPhaseMeter();
    this.setupWaveform();
  }

  createInstruments() {
    this.instruments.kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 10,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
    }).toDestination();

    this.instruments.bass = new Tone.MonoSynth({
      oscillator: { type: "sawtooth" },
      filter: { Q: 6, type: "lowpass", frequency: 1000 },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 },
      filterEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.4, baseFrequency: 80, octaves: 4 },
    }).toDestination();
    this.instruments.bass.volume.value = 5;

    this.instruments.hat = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
    }).toDestination();
    this.instruments.hat.volume.value = -10;

    this.instruments.snare = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0 },
    }).toDestination();
    this.instruments.snare.volume.value = -5;
  }

  async loadAvailableBeats() {
    const availableBeats = await getAvailableBeats();
    if (availableBeats.length > 0) {
      this.currentBeat = await loadBeat(0);
      if (this.currentBeat && this.currentBeat.bpm) {
        this.bpm = this.currentBeat.bpm;
        const bpmDisplay = document.getElementById("bpm-display");
        if (bpmDisplay) {
          bpmDisplay.textContent = this.bpm;
        }
      }
      this.loadSection(0);
      this.updateSectionDisplay();
    }
  }

  updateSectionDisplay() {
    const sectionDisplay = document.getElementById("section-display");
    if (sectionDisplay && this.currentBeat && this.currentBeat.sections && this.currentBeat.sections[this.currentSection]) {
      const beatName = this.currentBeat.name || "Unknown Beat";
      const sectionName = this.currentBeat.sections[this.currentSection].name;
      sectionDisplay.textContent = `${beatName} - Section ${this.currentSection + 1}: ${sectionName}`;
    }
  }

  loadSection(sectionIndex) {
    if (!this.currentBeat || !this.currentBeat.sections || !this.currentBeat.sections[sectionIndex]) {
      return;
    }

    const section = this.currentBeat.sections[sectionIndex];
    const instruments = section.instruments;

    Object.values(this.sequences).forEach((seq) => {
      if (seq) seq.dispose();
    });
    this.sequences = {};

    if (instruments.kick) {
      this.sequences.kick = new Tone.Sequence(
        (time, step) => {
          if (step) this.instruments.kick.triggerAttackRelease("C0", "8n", time);
        },
        instruments.kick.pattern || [1, 0, 0, 0],
        "16n"
      );
    }

    if (instruments.bass) {
      this.sequences.bass = new Tone.Sequence(
        (time, note) => {
          if (note) this.instruments.bass.triggerAttackRelease(note, "8n", time);
        },
        instruments.bass.pattern || ["C1"],
        "16n"
      );
    }

    if (instruments.hat) {
      this.sequences.hat = new Tone.Sequence(
        (time, step) => {
          if (step) this.instruments.hat.triggerAttackRelease("32n", time);
        },
        instruments.hat.pattern || [1, 0, 1, 0],
        "16n"
      );
    }

    if (instruments.snare) {
      this.sequences.snare = new Tone.Sequence(
        (time, step) => {
          if (step) this.instruments.snare.triggerAttackRelease("8n", time);
        },
        instruments.snare.pattern || [0, 0, 1, 0],
        "16n"
      );
    }
  }

  createControls() {
    document.getElementById("start").addEventListener("click", () => this.togglePlay());
    document.getElementById("prev-section").addEventListener("click", () => this.previousSection());
    document.getElementById("next-section").addEventListener("click", () => this.nextSection());
    document.getElementById("bpm-down").addEventListener("click", () => this.adjustBPM(-1));
    document.getElementById("bpm-up").addEventListener("click", () => this.adjustBPM(1));
    document.getElementById("master-volume").addEventListener("input", (e) => {
      Tone.getDestination().volume.value = parseFloat(e.target.value);
    });

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.togglePlay();
      }
      if (e.code === "ArrowLeft") this.previousSection();
      if (e.code === "ArrowRight") this.nextSection();
      if (e.code === "ArrowUp") this.adjustBPM(1);
      if (e.code === "ArrowDown") this.adjustBPM(-1);
    });
  }

  async togglePlay() {
    if (!this.isPlaying) {
      await this.start();
    } else {
      this.stop();
    }
  }

  async start() {
    try {
      await Tone.start();

      Tone.getTransport().stop();
      Tone.getTransport().cancel();

      Object.values(this.sequences).forEach((seq) => {
        if (seq) seq.dispose();
      });

      this.loadSection(this.currentSection);

      Object.values(this.sequences).forEach((seq) => seq.start(0));

      Tone.getTransport().bpm.value = this.bpm;
      Tone.getTransport().start();

      this.isPlaying = true;

      const startButton = document.getElementById("start");
      if (startButton) startButton.textContent = "Stop Beat";
    } catch (error) {
      console.log(error);
    }
  }

  stop() {
    Tone.getTransport().stop();

    this.isPlaying = false;

    const startButton = document.getElementById("start");
    if (startButton) startButton.textContent = "Start Beat";
  }

  previousSection() {
    if (!this.currentBeat || !this.currentBeat.sections) return;
    this.currentSection = Math.max(0, this.currentSection - 1);
    this.updateSection();
  }

  nextSection() {
    if (!this.currentBeat || !this.currentBeat.sections) return;
    this.currentSection = Math.min(this.currentBeat.sections.length - 1, this.currentSection + 1);
    this.updateSection();
  }

  updateSection() {
    const wasPlaying = this.isPlaying;
    if (wasPlaying) this.stop();

    this.loadSection(this.currentSection);
    this.updateSectionDisplay();

    if (wasPlaying) this.start();
  }

  adjustBPM(delta) {
    this.bpm = Math.max(60, Math.min(200, this.bpm + delta));
    Tone.getTransport().bpm.value = this.bpm;
    document.getElementById("bpm-display").textContent = this.bpm;
  }

  setupPhaseMeter() {
    this.updatePhaseMeter();
  }

  updatePhaseMeter() {
    if (!this.isPlaying) {
      requestAnimationFrame(() => this.updatePhaseMeter());
      return;
    }

    const transportTime = Tone.getTransport().seconds;
    const barLength = (60 / this.bpm) * 4;
    const beatLength = 60 / this.bpm;

    const barPosition = (transportTime % barLength) / barLength;
    const beatPosition = (transportTime % beatLength) / beatLength;

    const fullNotesIndicator = document.querySelector(".full-notes-indicator");
    const quarterNotesIndicator = document.querySelector(".quarter-notes-indicator");

    if (fullNotesIndicator) {
      fullNotesIndicator.style.left = `${barPosition * 100}%`;
    }

    if (quarterNotesIndicator) {
      quarterNotesIndicator.style.left = `${beatPosition * 100}%`;
    }

    requestAnimationFrame(() => this.updatePhaseMeter());
  }

  setupWaveform() {
    this.canvas = document.getElementById("scope-master");
    if (!this.canvas) return;

    this.canvasCtx = this.canvas.getContext("2d");
    this.waveform = new Tone.Waveform(1024);

    Tone.getDestination().connect(this.waveform);

    this.drawWaveform();
  }

  drawWaveform() {
    if (!this.canvas || !this.canvasCtx || !this.waveform) {
      requestAnimationFrame(() => this.drawWaveform());
      return;
    }

    const width = this.canvas.width;
    const height = this.canvas.height;
    const bufferLength = this.waveform.size;
    const dataArray = this.waveform.getValue();

    this.canvasCtx.fillStyle = "#001122";
    this.canvasCtx.fillRect(0, 0, width, height);

    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeStyle = "#00ff88";
    this.canvasCtx.beginPath();

    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] * 0.5 + 0.5;
      const y = v * height;

      if (i === 0) {
        this.canvasCtx.moveTo(x, y);
      } else {
        this.canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.canvasCtx.stroke();

    requestAnimationFrame(() => this.drawWaveform());
  }
}

const beatMachine = new SimpleBeatMachine();
beatMachine.initialize();
window.beatMachine = beatMachine;
