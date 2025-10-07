const Tone = window.Tone;

export class EffectChain {
  constructor() {
    this.effects = [];
    this.input = new Tone.Gain();
    this.output = new Tone.Gain();
    this.lfos = new Map();
  }

  addEffect(effectConfig) {
    const effect = this.createEffect(effectConfig);
    this.effects.push({ effect, config: effectConfig });
    this.rebuild();
    return effect;
  }

  createEffect(config) {
    const { type, ...params } = config;

    switch (type) {
      case "distortion":
        return new Tone.Distortion(params.amount || 0.4);

      case "delay":
        return new Tone.PingPongDelay(params.time || "8n", params.feedback || 0.2);

      case "reverb":
        const reverb = new Tone.Reverb(params.roomSize || 0.8);
        reverb.wet.value = params.wet || 0.3;
        return reverb;

      case "chorus":
        return new Tone.Chorus(params.frequency || 1.5, params.delayTime || 2.5, params.depth || 0.7);

      case "compressor":
        return new Tone.Compressor(params.threshold || -12, params.ratio || 3);

      case "filter":
      case "lowpass":
        return new Tone.Filter(params.frequency || 1000, "lowpass", params.rolloff || -12);

      case "highpass":
        return new Tone.Filter(params.frequency || 200, "highpass", params.rolloff || -12);

      case "bandpass":
        const filter = new Tone.Filter(params.frequency || 1000, "bandpass", params.rolloff || -12);
        if (params.Q) filter.Q.value = params.Q;
        return filter;

      case "bitcrusher":
        return new Tone.BitCrusher(params.bits || 8);

      case "chebyshev":
        return new Tone.Chebyshev(params.order || 50);

      case "phaser":
        return new Tone.Phaser(params.frequency || 0.5, params.octaves || 3, params.baseFrequency || 350);

      case "tremolo":
        return new Tone.Tremolo(params.frequency || 10, params.depth || 0.5);

      case "autofilter":
        return new Tone.AutoFilter(params.frequency || 1, params.baseFrequency || 200, params.octaves || 2.6);

      case "lfo":
        return this.createLFO(config);

      default:
        return new Tone.Gain();
    }
  }

  createLFO(config) {
    const lfo = new Tone.LFO(config.frequency || 1, config.min || 0, config.max || 1);

    const lfoId = `lfo_${Date.now()}_${Math.random()}`;
    this.lfos.set(lfoId, { lfo, config });

    return {
      type: "lfo",
      id: lfoId,
      connect: (target) => {
        lfo.connect(target);
        lfo.start();
      },
    };
  }

  connectLFOs(instrument) {
    this.lfos.forEach(({ lfo, config }) => {
      const target = this.getTargetParameter(instrument, config.target);
      if (target) {
        lfo.connect(target);
        lfo.start();
      }
    });
  }

  getTargetParameter(instrument, targetPath) {
    const paths = targetPath.split(".");
    let current = instrument;

    try {
      for (const path of paths) {
        if (current && current[path] !== undefined) {
          current = current[path];
        } else {
          if (path === "filter" && current.filter) {
            current = current.filter;
          } else if (path === "frequency" && current.frequency) {
            current = current.frequency;
          } else {
            return null;
          }
        }
      }
      return current;
    } catch (error) {
      return null;
    }
  }

  rebuild() {
    this.input.disconnect();
    this.output.disconnect();

    if (this.effects.length === 0) {
      this.input.connect(this.output);
      return;
    }

    const audioEffects = this.effects.filter(({ effect }) => effect.type !== "lfo");

    if (audioEffects.length === 0) {
      this.input.connect(this.output);
      return;
    }

    let current = this.input;

    audioEffects.forEach(({ effect }, index) => {
      current.connect(effect);
      current = effect;

      if (index === audioEffects.length - 1) {
        current.connect(this.output);
      }
    });
  }

  connect(destination) {
    this.output.connect(destination);
  }

  disconnect() {
    this.output.disconnect();
  }

  dispose() {
    this.effects.forEach(({ effect }) => {
      if (effect.dispose) effect.dispose();
    });

    this.lfos.forEach(({ lfo }) => {
      lfo.dispose();
    });

    this.input.dispose();
    this.output.dispose();
    this.effects = [];
    this.lfos.clear();
  }
}

export function createEffectChain(effectConfigs = []) {
  const chain = new EffectChain();

  effectConfigs.forEach((config) => {
    chain.addEffect(config);
  });

  return chain;
}
