import { TerminalApp } from '../core/terminal-app';
import { SoundManager } from '../core/sound-manager';

/**
 * Register sound plugin
 */
export function registerSoundPlugin(app: TerminalApp, soundManager: SoundManager): void {
  // sound command - manage sound settings
  app.registerCommand(
    'sound',
    'Manage terminal sound effects',
    (args: string[], app: TerminalApp) => {
      if (args.length === 0) {
        // Show usage
        app.printLine('');
        app.printLine('Sound Manager', 'section-header');
        app.printLine('=============', 'section-header');
        app.printLine('');
        app.printLine('Usage:');
        app.printLine('  sound status       - Show current sound state');
        app.printLine('  sound on           - Enable sound effects');
        app.printLine('  sound off          - Disable sound effects');
        app.printLine('  sound test         - Play test sequence');
        app.printLine('');
        return;
      }

      const subcommand = args[0].toLowerCase();

      switch (subcommand) {
        case 'status':
          handleSoundStatus(app, soundManager);
          break;
        case 'on':
          handleSoundToggle(app, soundManager, true);
          break;
        case 'off':
          handleSoundToggle(app, soundManager, false);
          break;
        case 'test':
          handleSoundTest(app, soundManager);
          break;
        default:
          app.printLine(`Unknown subcommand: ${subcommand}`, 'error');
          app.printLine('Type "sound" for usage.', 'hint');
      }
    },
    // Autocomplete handler
    (_args: string[], _currentWord: string, _app: TerminalApp) => {
      return ['status', 'on', 'off', 'test'];
    }
  );

  // play command - play custom tones
  app.registerCommand(
    'play',
    'Play a tone at specified frequency',
    (args: string[], app: TerminalApp) => {
      if (args.length === 0) {
        app.printLine('');
        app.printLine('Usage: play <frequency> [duration] [volume]', 'hint');
        app.printLine('');
        app.printLine('Examples:');
        app.printLine('  play 440              - Play 440Hz for 200ms');
        app.printLine('  play 440 500          - Play 440Hz for 500ms');
        app.printLine('  play 440 500 0.5      - Play 440Hz for 500ms at 50% volume');
        app.printLine('');
        app.printLine('Frequency: 20-20000 Hz (typical range: 200-2000)');
        app.printLine('Duration: milliseconds (default: 200)');
        app.printLine('Volume: 0.0-1.0 (default: 0.3)');
        app.printLine('');
        return;
      }

      // Parse arguments
      const frequency = parseFloat(args[0]);
      const duration = args[1] ? parseFloat(args[1]) : 200;
      const volume = args[2] ? parseFloat(args[2]) : 0.3;

      // Validate inputs
      if (isNaN(frequency) || frequency < 20 || frequency > 20000) {
        app.printLine('Error: Frequency must be between 20 and 20000 Hz', 'error');
        return;
      }

      if (isNaN(duration) || duration < 10 || duration > 5000) {
        app.printLine('Error: Duration must be between 10 and 5000 ms', 'error');
        return;
      }

      if (isNaN(volume) || volume < 0 || volume > 1) {
        app.printLine('Error: Volume must be between 0.0 and 1.0', 'error');
        return;
      }

      if (!soundManager.isEnabled()) {
        app.printLine('Warning: Sound is currently disabled. Use "sound on" to enable.', 'hint');
        return;
      }

      // Play the tone
      soundManager.playBeep(frequency, duration, volume);
      app.printLine(`Playing ${frequency}Hz for ${duration}ms at volume ${volume.toFixed(2)}`);
    }
  );
}

/**
 * Handle sound status command
 */
function handleSoundStatus(app: TerminalApp, soundManager: SoundManager): void {
  const enabled = soundManager.isEnabled();
  app.printLine('');
  app.printLine('Sound Status', 'section-header');
  app.printLine('============', 'section-header');
  app.printLine('');
  app.printLine(`Sound effects: ${enabled ? 'ENABLED' : 'DISABLED'}`);
  app.printLine('');
  if (enabled) {
    app.printLine('Use "sound off" to disable sound effects.', 'hint');
  } else {
    app.printLine('Use "sound on" to enable sound effects.', 'hint');
  }
  app.printLine('');
}

/**
 * Handle sound toggle command
 */
function handleSoundToggle(app: TerminalApp, soundManager: SoundManager, enable: boolean): void {
  soundManager.setEnabled(enable);
  app.printLine('');
  if (enable) {
    app.printLine('Sound effects enabled.', 'hint');
    // Play a test beep to confirm
    soundManager.playSuccess();
  } else {
    app.printLine('Sound effects disabled.', 'hint');
  }
  app.printLine('');
}

/**
 * Handle sound test command
 */
async function handleSoundTest(app: TerminalApp, soundManager: SoundManager): Promise<void> {
  if (!soundManager.isEnabled()) {
    app.printLine('Error: Sound is disabled. Use "sound on" to enable.', 'error');
    return;
  }

  app.printLine('');
  app.printLine('Playing sound test sequence...', 'hint');
  app.printLine('');

  // Helper to wait
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Test sequence
  app.printLine('Info beep (500Hz)...');
  soundManager.playInfo();
  await wait(400);

  app.printLine('Success beep (600Hz)...');
  soundManager.playSuccess();
  await wait(400);

  app.printLine('Warning beep (700Hz)...');
  soundManager.playWarning();
  await wait(500);

  app.printLine('Error beep (800Hz)...');
  soundManager.playError();
  await wait(400);

  app.printLine('');
  app.printLine('Test complete.', 'hint');
  app.printLine('');
}

