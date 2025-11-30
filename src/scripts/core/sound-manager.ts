/**
 * Sound Manager
 * Manages retro computer sounds using Web Audio API
 */
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private readonly STORAGE_KEY = 'retro-os-sound-enabled';
  private initialized: boolean = false;

  // Sound presets (frequency in Hz, duration in ms)
  private readonly PRESETS = {
    error: { frequency: 800, duration: 200, volume: 0.3 },
    success: { frequency: 600, duration: 150, volume: 0.25 },
    warning: { frequency: 700, duration: 300, volume: 0.28 },
    info: { frequency: 500, duration: 100, volume: 0.2 },
  };

  constructor() {
    // Load saved preference
    this.loadPreference();
  }

  /**
   * Initialize AudioContext (requires user interaction)
   */
  private initAudioContext(): void {
    if (this.initialized) return;

    try {
      // Use standard or webkit prefixed AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported');
        return;
      }

      this.audioContext = new AudioContextClass();
      this.initialized = true;
    } catch (error) {
      console.warn('Failed to initialize AudioContext:', error);
    }
  }

  /**
   * Play a beep sound with specified parameters
   */
  public playBeep(frequency: number, duration: number, volume: number = 0.3): void {
    if (!this.enabled) return;

    // Initialize on first use (ensures user interaction requirement is met)
    if (!this.initialized) {
      this.initAudioContext();
    }

    if (!this.audioContext) return;

    try {
      // Resume context if suspended (browser autoplay policy)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Create oscillator for beep sound
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Connect nodes: oscillator -> gain -> destination
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure oscillator
      oscillator.type = 'square'; // Square wave for retro sound
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

      // Configure gain (volume envelope for less harsh sound)
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + duration / 1000
      );

      // Play sound
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);

      // Clean up after sound finishes
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.warn('Failed to play beep:', error);
    }
  }

  /**
   * Play error sound (harsh, urgent)
   */
  public playError(): void {
    const preset = this.PRESETS.error;
    this.playBeep(preset.frequency, preset.duration, preset.volume);
  }

  /**
   * Play success sound (pleasant, short)
   */
  public playSuccess(): void {
    const preset = this.PRESETS.success;
    this.playBeep(preset.frequency, preset.duration, preset.volume);
  }

  /**
   * Play warning sound (attention-grabbing)
   */
  public playWarning(): void {
    const preset = this.PRESETS.warning;
    this.playBeep(preset.frequency, preset.duration, preset.volume);
  }

  /**
   * Play info sound (subtle notification)
   */
  public playInfo(): void {
    const preset = this.PRESETS.info;
    this.playBeep(preset.frequency, preset.duration, preset.volume);
  }

  /**
   * Check if sounds are enabled
   */
  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Enable or disable sounds
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.savePreference();
  }

  /**
   * Load preference from localStorage
   */
  private loadPreference(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    } catch (error) {
      console.warn('Could not load sound preference:', error);
    }
  }

  /**
   * Save preference to localStorage
   */
  private savePreference(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, String(this.enabled));
    } catch (error) {
      console.warn('Could not save sound preference:', error);
    }
  }

  /**
   * Clean up audio resources
   */
  public dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.initialized = false;
    }
  }
}

