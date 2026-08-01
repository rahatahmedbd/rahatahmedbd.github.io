/**
 * Procedural ambient audio (Web Audio) — no external audio files.
 * City ambience, wind, soft electronic pad, drones and fountain are all
 * synthesized so the world ships lightweight and stays subtle.
 */
export class VerseAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;
  private started = false;
  private nodes: AudioNode[] = [];

  private ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.5;
    this.master.connect(this.ctx.destination);
  }

  /** Must be called from a user gesture to satisfy autoplay policies. */
  start() {
    this.ensure();
    if (!this.ctx || this.started) return;
    this.started = true;
    this.buildAmbience();
  }

  private noiseBuffer(): AudioBuffer {
    const ctx = this.ctx!;
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  private buildAmbience() {
    const ctx = this.ctx!;
    const master = this.master!;

    // --- wind (filtered noise, slow LFO) ---
    const wind = ctx.createBufferSource();
    wind.buffer = this.noiseBuffer();
    wind.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.value = 420;
    windFilter.Q.value = 0.6;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.06;
    const windLfo = ctx.createOscillator();
    windLfo.frequency.value = 0.08;
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 0.03;
    windLfo.connect(windLfoGain).connect(windGain.gain);
    wind.connect(windFilter).connect(windGain).connect(master);
    wind.start();
    windLfo.start();
    this.nodes.push(wind, windLfo);

    // --- low electronic pad (detuned saws through lowpass) ---
    const padGain = ctx.createGain();
    padGain.gain.value = 0.028;
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 420;
    const padLfo = ctx.createOscillator();
    padLfo.frequency.value = 0.06;
    const padLfoGain = ctx.createGain();
    padLfoGain.gain.value = 0.01;
    padLfo.connect(padLfoGain).connect(padGain.gain);
    for (const freq of [110, 165, 220, 277]) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      osc.detune.value = Math.random() * 8 - 4;
      osc.connect(padFilter);
      osc.start();
      this.nodes.push(osc);
    }
    padFilter.connect(padGain).connect(master);
    padLfo.start();
    this.nodes.push(padLfo);

    // --- slow shimmer (high sine arpeggio, very soft) ---
    const shimGain = ctx.createGain();
    shimGain.gain.value = 0.008;
    const shimLfo = ctx.createOscillator();
    shimLfo.frequency.value = 0.18;
    const shimLfoG = ctx.createGain();
    shimLfoG.gain.value = 0.005;
    shimLfo.connect(shimLfoG).connect(shimGain.gain);
    for (const freq of [880, 1320, 1760]) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.5;
      const o = ctx.createOscillator();
      o.frequency.value = 0.1 + Math.random() * 0.1;
      const og = ctx.createGain();
      og.gain.value = 0.5;
      o.connect(og).connect(g.gain);
      osc.connect(g).connect(shimGain);
      osc.start();
      o.start();
      this.nodes.push(osc, o);
    }
    shimGain.connect(master);
    shimLfo.start();
    this.nodes.push(shimLfo);

    // --- fountain (bubbly filtered noise, pulsed) ---
    const fount = ctx.createBufferSource();
    fount.buffer = this.noiseBuffer();
    fount.loop = true;
    const fFilter = ctx.createBiquadFilter();
    fFilter.type = "bandpass";
    fFilter.frequency.value = 1400;
    fFilter.Q.value = 2.2;
    const fGain = ctx.createGain();
    fGain.gain.value = 0.012;
    const fLfo = ctx.createOscillator();
    fLfo.frequency.value = 6;
    const fLfoG = ctx.createGain();
    fLfoG.gain.value = 0.006;
    fLfo.connect(fLfoG).connect(fGain.gain);
    fount.connect(fFilter).connect(fGain).connect(master);
    fount.start();
    fLfo.start();
    this.nodes.push(fount, fLfo);

    // --- distant drone hum ---
    const drone = ctx.createBufferSource();
    drone.buffer = this.noiseBuffer();
    drone.loop = true;
    const dFilter = ctx.createBiquadFilter();
    dFilter.type = "lowpass";
    dFilter.frequency.value = 220;
    const dGain = ctx.createGain();
    dGain.gain.value = 0.02;
    drone.connect(dFilter).connect(dGain).connect(master);
    drone.start();
    this.nodes.push(drone);
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(m ? 0 : 0.5, this.ctx.currentTime, 0.2);
    }
  }

  dispose() {
    this.nodes.forEach((n) => {
      try {
        (n as any).stop?.();
        n.disconnect();
      } catch {
        /* noop */
      }
    });
    this.nodes = [];
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.started = false;
  }
}
