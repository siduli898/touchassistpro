/**
 * Web Audio API synthesizer for assistive sounds, volume feedback, and emergency sirens.
 * Works reliably on all modern mobile browsers without external audio dependencies.
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private sirenInterval: number | null = null;
  private isSirenPlaying = false;

  private getAudioContext(): AudioContext | null {
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

  // Trigger tactile vibration if supported
  public vibrate(pattern: number | number[] = 40): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore if vibration is restricted by policy
      }
    }
  }

  // Play click / tap feedback
  public playClick(): void {
    this.vibrate(25);
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio autoplay restrictions
    }
  }

  // Play volume level feedback tone (frequency scales with volume 0-100%)
  public playVolumeTone(volumePercent: number): void {
    this.vibrate(30);
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      
      // Pitch goes from 300Hz (0%) to 1200Hz (100%)
      const freq = 300 + (Math.max(0, Math.min(100, volumePercent)) * 9);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const amp = Math.max(0.05, Math.min(0.3, volumePercent / 250));
      gain.gain.setValueAtTime(amp, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      // audio safety
    }
  }

  // Play screen sleep standby sound
  public playSleepTone(): void {
    this.vibrate([50, 40, 30]);
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {
      // audio safety
    }
  }

  // Play screen wake sound
  public playWakeTone(): void {
    this.vibrate([30, 40, 70]);
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.21);
    } catch {
      // audio safety
    }
  }

  // Play high priority battery alert siren (alternating 900Hz and 650Hz)
  public startEmergencySiren(): void {
    if (this.isSirenPlaying) return;
    this.isSirenPlaying = true;
    this.vibrate([200, 100, 200, 100, 300]);

    const playSirenBurst = () => {
      const ctx = this.getAudioContext();
      if (!ctx || !this.isSirenPlaying) return;

      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(650, now + 0.25);
        osc.frequency.linearRampToValueAtTime(880, now + 0.5);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.45);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.51);

        this.vibrate([150, 80, 150]);
      } catch {
        // audio safety
      }
    };

    playSirenBurst();
    this.sirenInterval = window.setInterval(playSirenBurst, 900);
  }

  public stopEmergencySiren(): void {
    this.isSirenPlaying = false;
    if (this.sirenInterval !== null) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
  }

  public getIsSirenPlaying(): boolean {
    return this.isSirenPlaying;
  }
}

export const soundEffects = new SoundEffectsService();
