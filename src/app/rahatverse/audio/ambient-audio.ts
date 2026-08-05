/**
 * RahatVerse ambient audio engine.
 *
 * The ambience is synthesized in real time with the Web Audio API —
 * no audio files are shipped, so there is no licensing concern, no
 * binary assets, and the sound can react to the lighting theme
 * (day = brighter city hum, night = quiet calm tone).
 *
 * Autoplay policy: the AudioContext is created/resumed only inside a
 * user gesture (the mute/unmute button click or any interaction), so
 * sound never starts on its own.
 */

type TimeOfDay = "morning" | "day" | "evening" | "night";

type SfxKind = "building" | "minimap";

interface AmbientThemeParams {
  /** Master volume for the ambient bed (0..1). */
  gain: number;
  /** Lowpass cutoff for the pad (Hz). */
  filter: number;
  /** Filter LFO depth (Hz). */
  lfoDepth: number;
  /** Filter LFO speed (Hz). */
  lfoRate: number;
  /** Noise (wind/city texture) volume (0..1). */
  noise: number;
  /** Slight pitch offset of the second oscillator (semitones). */
  detune: number;
}

const THEME_PARAMS: Record<TimeOfDay, AmbientThemeParams> = {
  morning: { gain: 0.05, filter: 900, lfoDepth: 220, lfoRate: 0.06, noise: 0.02, detune: 4 },
  day: { gain: 0.065, filter: 1400, lfoDepth: 300, lfoRate: 0.09, noise: 0.032, detune: 7 },
  evening: { gain: 0.045, filter: 650, lfoDepth: 150, lfoRate: 0.05, noise: 0.014, detune: 5 },
  night: { gain: 0.03, filter: 380, lfoDepth: 90, lfoRate: 0.035, noise: 0.008, detune: 3 },
};

class RahatVerseAudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  /** All startable sources (oscillators + noise loop). */
  private sources: Array<OscillatorNode | AudioBufferSourceNode> = [];

  private enabled = false;
  private theme: TimeOfDay = "day";

  private ensureContext(): boolean {
    try {
      if (!this.context) {
        const AudioCtor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtor) return false;
        this.context = new AudioCtor();
        this.master = this.context.createGain();
        this.master.gain.value = 0;
        this.master.connect(this.context.destination);
        this.buildAmbientVoice();
      }
      if (this.context.state === "suspended") {
        void this.context.resume();
      }
      return true;
    } catch {
      return false;
    }
  }

  private buildAmbientVoice() {
    const ctx = this.context;
    const master = this.master;
    if (!ctx || !master) return;

    // Pad: two detuned triangle oscillators (calm, low).
    const baseFreq = 110; // A2
    const osc1 = ctx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.value = baseFreq;
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = baseFreq * 1.5; // fifth, E3
    const detune = ctx.createOscillator();
    detune.frequency.value = 0.05;
    const detuneGain = ctx.createGain();
    detuneGain.gain.value = 10;
    detune.connect(detuneGain);
    detuneGain.connect(osc2.detune);

    // Filter shapes the pad per theme.
    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = THEME_PARAMS.day.filter;
    this.filter.Q.value = 0.6;

    // LFO slowly opens/closes the filter (breathing).
    this.lfo = ctx.createOscillator();
    this.lfo.type = "sine";
    this.lfo.frequency.value = THEME_PARAMS.day.lfoRate;
    this.lfoGain = ctx.createGain();
    this.lfoGain.gain.value = THEME_PARAMS.day.lfoDepth;
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.filter.frequency);

    // Wind/city texture: looped white noise through a bandpass.
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 800;
    noiseFilter.Q.value = 0.5;
    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = THEME_PARAMS.day.noise;
    this.noiseSource.connect(noiseFilter);
    noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.filter);

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = 0;
    this.ambientGain.connect(master);

    osc1.connect(this.filter);
    osc2.connect(this.filter);
    this.filter.connect(this.ambientGain);

    this.sources = [osc1, osc2, detune, this.lfo, this.noiseSource];
    for (const source of this.sources) source.start();
  }

  /** Turn the ambience on/off (called from the toggle — a user gesture). */
  setEnabled(next: boolean) {
    this.enabled = next;
    if (next) {
      if (!this.ensureContext()) return;
      const ctx = this.context;
      const master = this.master;
      if (!ctx || !master) return;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(1, now, 0.4);
      this.applyTheme(this.theme, now);
    } else {
      const ctx = this.context;
      const master = this.master;
      if (!ctx || !master) return;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(0, now, 0.25);
      // Suspend shortly after the fade-out to release the audio device.
      window.setTimeout(() => {
        if (!this.enabled && this.context && this.context.state === "running") {
          void this.context.suspend();
        }
      }, 900);
    }
  }

  /** Retune the ambient bed to the current lighting theme. */
  setTheme(theme: TimeOfDay) {
    this.theme = theme;
    if (this.enabled && this.context) {
      this.applyTheme(theme, this.context.currentTime);
    }
  }

  private applyTheme(theme: TimeOfDay, now: number) {
    const params = THEME_PARAMS[theme];
    const ctx = this.context;
    if (!ctx) return;
    const t = now + 0.05;
    if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(params.gain, t, 1.2);
    }
    if (this.filter) {
      this.filter.frequency.setTargetAtTime(params.filter, t, 1.2);
    }
    if (this.lfo) {
      this.lfo.frequency.setTargetAtTime(params.lfoRate, t, 1.2);
    }
    if (this.lfoGain) {
      this.lfoGain.gain.setTargetAtTime(params.lfoDepth, t, 1.2);
    }
    if (this.noiseGain) {
      this.noiseGain.gain.setTargetAtTime(params.noise, t, 1.2);
    }
    for (const source of this.sources) {
      if (source instanceof OscillatorNode) {
        source.detune.setTargetAtTime(params.detune, t, 1.2);
      }
    }
  }

  /** Short, subtle feedback blip. Only plays while sound is enabled. */
  playSfx(kind: SfxKind) {
    if (!this.enabled) return;
    if (!this.ensureContext()) return;
    const ctx = this.context;
    if (!ctx || !this.master) return;
    if (ctx.state !== "running") return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = kind === "building" ? 620 : 480;
    const end = kind === "building" ? 880 : 520;
    const duration = kind === "building" ? 0.14 : 0.07;
    const volume = kind === "building" ? 0.12 : 0.08;

    osc.type = kind === "building" ? "sine" : "triangle";
    osc.frequency.setValueAtTime(start, now);
    osc.frequency.exponentialRampToValueAtTime(end, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  /** Release everything (scene unmount). */
  dispose() {
    try {
      for (const source of this.sources) {
        try {
          source.stop();
        } catch {
          // already stopped
        }
      }
    } catch {
      // ignore
    }
    this.sources = [];
    this.ambientGain = null;
    this.filter = null;
    this.lfo = null;
    this.lfoGain = null;
    this.noiseSource = null;
    this.noiseGain = null;
    this.master = null;
    if (this.context) {
      void this.context.close().catch(() => undefined);
      this.context = null;
    }
    this.enabled = false;
  }
}

/** Singleton shared by the RahatVerse scene and its UI. */
export const rahatVerseAudio = new RahatVerseAudioEngine();
