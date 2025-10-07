## Controls

- **Spacebar**: Start/Stop beat
- **Arrow Keys**: Navigate sections (←→) and adjust BPM (↑↓)
- **Section Buttons**: Switch between Intro, Build, Drop, Breakdown
- **BPM Controls**: Adjust tempo from 60-200 BPM
- **Master Volume**: Control overall output level

## Making Beats

### Pattern Formats

```javascript
Numbers: [1, 0, 1, 0] = hits and rests
Notes: ["C1", null, "F1", null] = play specific notes
Objects: [{ pitch: "C3", velocity: 0.8 }, null] = notes with velocity
```

### Available Instruments

#### **KICKS**

- `kick-808` - Classic 808 kick drum
- `kick-sub` - Deep sub kick
- `kick-hard` - Hard hitting kick
- `kick-acoustic` - Natural acoustic kick

#### **BASS**

- `bass-reese` - Reese bass (dark and gritty)
- `bass-acid` - Acid bass (303-style)
- `bass-sub` - Sub bass (deep and clean)
- `bass-pluck` - Pluck bass (sharp attack)

#### **LEADS**

- `acid-303` - Classic TB-303 acid lead
- `fm-bell` - FM bell lead
- `saw-lead` - Sawtooth lead
- `pluck-lead` - Plucked lead synth

#### **PADS**

- `pad-warm` - Warm analog pad
- `pad-ambient` - Ambient atmospheric pad
- `strings` - String section
- `choir` - Vocal choir pad

#### **DRUMS**

- `snare-clap` - Clap snare
- `snare-acoustic` - Natural snare
- `hat-closed` - Closed hi-hat
- `hat-open` - Open hi-hat
- `perc-shaker` - Shaker percussion

#### **FX**

- `sweep-up` - Rising sweep
- `sweep-down` - Falling sweep
- `impact` - Impact hit
- `riser` - Build-up riser

## 🎚️ Effects

### Basic Effects

```javascript
// Distortion
{ type: "distortion", amount: 0.4 }

// Delay
{ type: "delay", time: "8n", feedback: 0.3 }

// Reverb
{ type: "reverb", roomSize: 0.8, wet: 0.3 }

// Chorus
{ type: "chorus", frequency: 1.5, depth: 0.7 }
```

### Filters

```javascript
// Low-pass filter
{ type: "lowpass", frequency: 1000 }

// High-pass filter
{ type: "highpass", frequency: 200 }

// Band-pass filter
{ type: "bandpass", frequency: 1000, Q: 3 }
```

## Automation

Add movement to your sounds with LFO automation:

```javascript
automation: {
  "filter.frequency": { type: "lfo", rate: 0.3, min: 400, max: 1200 },
  "detune": { type: "lfo", rate: 0.2, min: -12, max: 12 }
}
```

## Beat Structure Template

```javascript
import { registerBeat } from "./index.js";

export const beat = {
  name: "Beat Name",
  bpm: 128,
  globalEffects: ["compressor"],

  sections: [
    {
      name: "Section Name",
      bars: 4,
      instruments: {
        kick: "kick-808",

        kick: {
          type: "kick-808",
          pattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
          volume: 1.0,
        },

        bass: {
          type: "bass-reese",
          pattern: ["C1", null, "F1", null, "C1", null, "Bb0", null, "C1", null, "F1", null, "C1", null, "Bb0", null],
          volume: 0.8,
        },

        lead: {
          type: "acid-303",
          pattern: [{ pitch: "C3", velocity: 0.8 }, null, { pitch: "Eb3", velocity: 0.6 }, { pitch: "F3", velocity: 0.9 }],
          volume: 0.7,
        },

        pad: {
          type: "pad-warm",
          pattern: ["C3", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          volume: 0.5,
          effects: [
            { type: "reverb", roomSize: 1.2, wet: 0.4 },
            { type: "delay", time: "8n", feedback: 0.3 },
          ],
        },

        bass: {
          type: "bass-acid",
          pattern: ["C1", "C1", "F1", "F1", "C1", "C1", "Bb0", "Bb0", "C1", "C1", "F1", "F1", "C1", "C1", "Bb0", "Bb0"],
          automation: {
            "filter.frequency": { type: "lfo", rate: 0.3, min: 400, max: 1200 },
          },
        },
      },
    },

    {
      name: "Another Section",
      bars: 8,
      instruments: {},
    },
  ],
};

registerBeat(beat);
```

## Tips for Great Beats

1. **Start Simple**: Begin with kick and bass, then add layers
2. **Use Automation**: LFO automation adds movement and interest
3. **Layer Effects**: Combine reverb, delay, and filters for depth
4. **Vary Velocity**: Use different velocities for dynamic patterns
5. **Build Energy**: Use different sections to create tension and release
