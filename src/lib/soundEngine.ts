// Luxury Web Audio API Sound Synthesizer Engine (Zero external MP3 dependencies)
// Designed specifically for Cariñosas.top Obsidian & Gold Experience

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const savedMute = localStorage.getItem("carinosas_sound_muted");
      this.isMuted = savedMute === "true";
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("carinosas_sound_muted", String(this.isMuted));
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Subtle obsidian tactile click for buttons and filter switches
   */
  public playSubtleClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  /**
   * Gold luxury chime - Harmonic two-tone bell for VIP activations and checkout
   */
  public playGoldChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const frequencies = [523.25, 659.25, 1046.5]; // C5, E5, C6 (Harmonic Triad)
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), ctx.currentTime + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.85);
      });
    } catch {}
  }

  /**
   * Sonar radar pulse for live interactive map
   */
  public playSonarPing() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {}
  }

  /**
   * Alias for radar pulse
   */
  public playRadarPing() {
    this.playSonarPing();
  }

  /**
   * 3D Metallic Card Tactile Flip Click
   */
  public playCardFlip() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  /**
   * Iris Aperture High-Tech Swoosh
   */
  public playIrisAperture() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.28);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.55);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {}
  }

  /**
   * Discreet Panic Disguise Camouflage Beep
   */
  public playPanicDisguise() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.04);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  /**
   * Warm harmonic greeting note for voice note preview
   */
  public playVoiceGreeting(durationSec: number = 3) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const chord = [329.63, 440.0, 554.37, 659.25]; // E4, A4, C#5, E5
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(freq * 1.02, ctx.currentTime + durationSec * 0.5);
        osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + durationSec);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04 / (idx + 1), ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + durationSec + 0.1);
      });
    } catch {}
  }

  /**
   * Deep metallic vault unlock mechanism sound
   */
  public playVaultUnlock() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const click1 = ctx.createOscillator();
      const clickGain1 = ctx.createGain();
      click1.type = "square";
      click1.frequency.setValueAtTime(300, ctx.currentTime);
      clickGain1.gain.setValueAtTime(0.1, ctx.currentTime);
      clickGain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      click1.connect(clickGain1);
      clickGain1.connect(ctx.destination);
      click1.start();
      click1.stop(ctx.currentTime + 0.06);

      const latch = ctx.createOscillator();
      const latchGain = ctx.createGain();
      latch.type = "sine";
      latch.frequency.setValueAtTime(120, ctx.currentTime + 0.1);
      latch.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.35);
      latchGain.gain.setValueAtTime(0.18, ctx.currentTime + 0.1);
      latchGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      latch.connect(latchGain);
      latchGain.connect(ctx.destination);
      latch.start(ctx.currentTime + 0.1);
      latch.stop(ctx.currentTime + 0.46);

      setTimeout(() => {
        this.playGoldChime();
      }, 350);
    } catch {}
  }
}

export const sound = new SoundEngine();
