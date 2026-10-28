/**
 * Web Audio API synthesizer for tactile POS hardware sound effects.
 * 100% offline, synthesized in real-time with zero external audio assets.
 */

class SoundEffectsController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Initialized on first user interaction
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Crisp, high-pitched barcode scanner beep (like a Honeywell/Zebra handheld laser scanner)
   */
  public playScannerBeep(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1850, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1920, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.065);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Error buzzer tone for unknown barcodes
   */
  public playErrorBuzz(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.21);
    } catch {
      // Fallback
    }
  }

  /**
   * Mechanical register drawer "ka-chink" sound on sale completion
   */
  public playCashRegisterChime(): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Mechanical click 1
      const click1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      click1.type = 'triangle';
      click1.frequency.setValueAtTime(320, now);
      click1.frequency.exponentialRampToValueAtTime(80, now + 0.04);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      click1.connect(gain1);
      gain1.connect(ctx.destination);
      click1.start(now);
      click1.stop(now + 0.05);

      // Bell chime
      const bell = ctx.createOscillator();
      const gainBell = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(987.77, now + 0.04); // B5 note
      gainBell.gain.setValueAtTime(0.14, now + 0.04);
      gainBell.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      bell.connect(gainBell);
      gainBell.connect(ctx.destination);
      bell.start(now + 0.04);
      bell.stop(now + 0.48);
    } catch {
      // Fallback
    }
  }
}

export const soundFx = new SoundEffectsController();
